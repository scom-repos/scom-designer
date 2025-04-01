import { IconName, IdUtils } from "@ijstech/components";
import { IComponent } from "../interface";
import { toJSON, toYAML } from "@scom/scom-yaml";

export const parseMD = (html: string) => {
  const blocks = html.split(/```/).filter(b => b.trim() !== "");
  let result: IComponent = {
    path: '',
    name: '',
    props: {},
    items: []
  }

  let list: any[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const match = checkMatches(block);
    if (!match) continue;
    const { name } = match;
    if (match.name === 'i-page-block') {
      if (result.name) list.push({ ...result });
      result = { ...match, items: [] };
    } else {
      const isGroup = name === 'i-page-group';
      const moduleName = isGroup ? 'i-page-block' : name;

      const lasElement = result.items?.[result.items.length - 1];
      if (lasElement?.hasItems) {
        lasElement.items = lasElement.items || [];
        lasElement.items.push({
          ...match,
          name: moduleName,
          hasItems: isGroup,
          parent: lasElement.path
        });
      } else if (result.name) {
        result.items = result.items || [];
        result.items.push({
          ...match,
          name: moduleName,
          hasItems: isGroup,
          parent: result.path
        });
      } else {
        result = {
          ...match,
          items: [],
          name: moduleName,
          parent: result.path
        }
      }
    }

    if (i === blocks.length - 1) {
      list.push({ ...result });
    }
  }

  return list;
}

const checkMatches = (content: string) => {
  const codeRegex = /([^{}]+)\{((?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*)\}(?:([\s\S]*))?/gm;
  const nameRegex = /[^{}]+/;
  const nameMatch = nameRegex.exec(content);
  let name = nameMatch?.[0] || '';

  if (name === '@scom/page-form') {
    content = content.replace(name, '');
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) { }

    const { data, ...tag } = parsed || {};
    return {
      path: IdUtils.generateUUID(),
      name: 'i-page-form',
      props: data,
      tag,
      icon: 'stop' as IconName
    };
  }

  const match = codeRegex.exec(content);
  let data = '';
  let textContent = '';
  let props = {};

  if (!match) return null;

  const splittedName = (match?.[1] || '').split('/');
  name = splittedName[splittedName.length - 1];
  textContent = match[3] || '';
  data = `${match[2] || ''}`
    .replace(/\n/gm, "")
    .replace(/&amp;/g, '&')
    .replace(/\{\s+/gm, "{")
    .replace(/\s+\}/gm, "}")
    .replace(/^\s*/gm, "")
    .replace(/\s*$/gm, "")
    .replace(/\,\s*/gm, ", ");

  if (data && data.includes(':')) {
    data = `{${data}}`;
    try {
      props = JSON.parse(data);
    } catch (e) {
      props = {}
      console.error('parse error: ', e, data);
    }
  }

  const { props: newProps, tag } = getProps(name, props, textContent);

  return {
    path: IdUtils.generateUUID(),
    name: name ? `i-${name}` : 'i-panel',
    props: newProps,
    tag,
    icon: 'stop' as IconName
  };
}

const getProps = (name: string, data: Record<string, any>, content: string) => {
  let props: Record<string, any> = {};
  let { data: dataVal, ...tag } = data;
  tag = tag || {};

  try {
    if (dataVal) {
      if (name === 'scom-image') {
        props.url = dataVal?.url || '';
      } else {
        props.data = dataVal;
      }
    }

    content = content.trim();
    if (content) {
      // if (name === 'page-button') {
      //   const contentRegex = /\[(.*?)\]\((.*?)\)/g;
      //   const match = contentRegex.exec(content);
      //   if (match) {
      //     if (!props.data) props.data = {};
      //     props.data.linkButtons = [
      //       {
      //         caption: match[1] || '',
      //         url: match[2] || ''
      //       }
      //     ]
      //   }
      // }
      if (name === 'page-text') {
        props.value = content;
      } else {
        const yamlProps = toJSON(content);
        if (name === 'scom-image-gallery') {
          props = { ...(props || {}), ...yamlProps };
        } else {
          props.data = yamlProps;
        }
      }
    }
  } catch (err) {
    console.error('parsed error: ', err);
  }

  return { props, tag };
}

export const renderMd = (root: IComponent, result: string) => {
  if (!root) return '';
  const rootName = root?.name || '';
  if (rootName.startsWith('i-page')) {
    const module = rootName.replace('i-', '@scom/');
    let { tag, data, value } = root?.props || {};
    result += `\n\`\`\`${module}{`;

    let content = '';
    if (data) {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = data.replace(/^{|}$/g, '');
      }

      const json = JSON.parse(data);
      content = toYAML(json);
    }
    if (typeof tag === 'string' && tag.startsWith('{{')) {
      tag = tag.replace(/^{{/, '{').replace(/}}$/, '}');
    }
    const parsedTag = typeof tag === 'string' ? JSON.parse(tag) : tag;

    const {
      light: lightTag,
      dark: darkTag,
      ...part
    } = parsedTag || {};
    const newTag: Record<string, any> = {
      ...(part || {})
    };

    if (Object.keys(newTag).length > 0) {
      let partString = JSON.stringify(newTag, null, 2);
      partString = partString.replace(/^{|}$/g, '');
      result += `${partString}`;
    }

    if (value) {
      content = value.replace(/^'|'$/g, "").replace(/^"|"$/g, "");
    }
    result += `}\n${content || ''}\n\`\`\`\n`;
  }

  if (root.items) {
    root.items.forEach(item => {
      result = renderMd(item, result);
    });
  }

  return result.trim();
}
