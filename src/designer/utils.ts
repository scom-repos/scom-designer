import { IconName, IdUtils } from "@ijstech/components";
import { IComponent } from "../interface";

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
    } catch (e) {}

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
  const { data: dataVal, ...tag } = data;
  try {
    if (dataVal) {
      if (name === 'scom-image') {
        props.url = dataVal?.url || '';
      } else if (name === 'scom-image-gallery') {
        props = {...(dataVal || {})}
      } else {
        props.data = dataVal;
      }
    }

    content = content.trim();
    if (content) {
      if (name === 'page-button') {
        const contentRegex = /\[(.*?)\]\((.*?)\)/g;
        const match = contentRegex.exec(content);
        if (match) {
          if (!props.data) props.data = {};
          props.data.linkButtons = [
            {
              caption: match[1] || '',
              url: match[2] || ''
            }
          ]
        }
      } else {
        props.value = content;
      }
    }
  } catch(err) {
    console.error('parsed error: ', err);
  }

  return { props, tag };
}

export const renderMd = (root: IComponent, result: string) => {
  if (root.name.startsWith('i-page')) {
    const module = root.name.replace('i-', '@scom/');
    let {tag, data, value} = root.props;
    result += `\n\`\`\`${module}{`;
    if (data) {
      if (data.startsWith('{')) {
        data = data.replace(/^{|}$/g, '');
      }
      result += `\n  "data": ${data}`;
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
    if (part) {
      let partString = JSON.stringify(part, null, 2);
      partString = partString.replace(/^{|}$/g, '');
      if (data && partString) result += ',';
      result += `${partString}`;
    }
    if (value) {
      value = value.replace(/^'|'$/g, "").replace(/^"|"$/g, "");
    }
    result += `}\n${value || ''}\n\`\`\`\n`;
  }

  if (root.items) {
    root.items.forEach(item => {
      result = renderMd(item, result);
    });
  }

  return result.trim();
}

export const pageWidgets = [
  '@scom/scom-image',
  '@scom/scom-image-gallery',
  '@scom/page-button',
  '@scom/page-text',
  '@scom/page-text-list',
  '@scom/page-block',
  '@scom/page-form',
  '@scom/page-breadcrumb',
  '@scom/page-blog'
];