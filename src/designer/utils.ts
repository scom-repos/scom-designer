import { IconName, IdUtils } from "@ijstech/components";
import { IComponent } from "../interface";
import { toJSON, toYAML } from "@scom/scom-yaml";

export const parseMD = (html: string, baseUrl: string) => {
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
    const match = checkMatches(block, baseUrl);
    if (!match) continue;
    const { name } = match;
    if (match.name === 'i-page-block') {
      if (result.name) list.push({ ...result });
      result = { ...match, items: [] };
    } else if (match.name === 'i-page-meta') {
      list.push({
        name: 'i-page-meta',
        props: match.props,
        items: []
      });
    } else {
      const isGroup = name === 'i-page-group';
      const moduleName = isGroup ? 'i-page-block' : name;
      result.hasItems = result.name === 'i-page-block' || result.name === 'i-page-group';
      let { item: lastElement, parent } = getLastItemBlock(result);

      if (lastElement) {
        if (parent?.tag?.direction && isGroup) {
          lastElement = parent;
        }
        lastElement.items = lastElement.items || [];
        lastElement.items.push({
          ...match,
          name: moduleName,
          hasItems: isGroup,
          parent: lastElement.path
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

const getLastItemBlock = (item: IComponent, parent?: IComponent) => {
  if (!item.hasItems) return null;
  if (item.hasItems && !item?.items?.length) return { item, parent };

  const items = item.items || [];
  if (items.length > 0) {
    const lastItem = items[items.length - 1];
    if (lastItem.hasItems) {
      return getLastItemBlock(lastItem, item);
    } else {
      return { item, parent };
    }
  }
}

const checkMatches = (content: string, baseUrl: string) => {
  const codeRegex = /([^{}]+)\{((?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*)\}(?:([\s\S]*))?/gm;
  const nameRegex = /[^{}]+/;
  const nameMatch = nameRegex.exec(content);
  let name = nameMatch?.[0] || '';

  const match = codeRegex.exec(content);
  let data = '';
  let textContent = '';
  let props = {};

  if (!match) return null;

  const splittedName = (match?.[1] || '').trim().split('/');
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

  const { props: newProps, tag } = getProps(name, props, textContent, baseUrl);

  return {
    path: IdUtils.generateUUID(),
    name: name ? `i-${name}` : 'i-panel',
    props: newProps,
    tag,
    icon: 'stop' as IconName
  };
}

const getProps = (name: string, data: Record<string, any>, content: string, baseUrl: string) => {
  let props: Record<string, any> = {};
  let { data: dataVal, ...tag } = data;
  tag = tag || {};
  if (baseUrl) {
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    if (baseUrl.endsWith('src')) baseUrl = baseUrl.slice(0, -4);
  }

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
      if (name === 'page-text') {
        const imageRegex = /<img src="([^"]+)"/g;
        if (imageRegex.test(content)) {
          content = content.replace(imageRegex, (match, p1) => {
            if (p1.startsWith('/')) p1 = p1.slice(1);
            return `<img src="${baseUrl}/${p1}"`;
          });
        }
        props.value = content;
      } else {
        const yamlProps = toJSON(content);
        if (name === 'scom-image-gallery' || name === 'page-form') {
          props = { ...(props || {}), ...yamlProps };
        }
        else if (name === 'scom-image') {
          let url = yamlProps?.url;
          if (url && baseUrl) {
            if (url.startsWith('/')) url = url.slice(1);
            if (!url.startsWith('http')) url = baseUrl + '/' + url;
          }
          props = { ...(props || {}), ...yamlProps, url };
        }
        else {
          props.data = yamlProps;
        }
      }
    }
  } catch (err) {
    console.error('parsed error: ', err);
  }

  return { props, tag };
}

let pos = 0;
let startLine = -1;
let endLine = -1;

export const renderMd = (root: IComponent, result: string, positions: number[], hasParentPageBlock?: boolean) => {
  if (!root) return '';
  let rootName = root?.name || '';
  if (hasParentPageBlock && rootName === 'i-page-block') {
    rootName = 'i-page-group';
  }

  if (rootName.startsWith('i-page') || rootName.startsWith('i-scom')) {
    ++pos;
    const module = rootName.replace('i-', '@scom/');
    let { tag, value, data, ...customSettings } = root?.props || {};

    const isSelected = pos !== undefined && positions.includes(pos);

    if (isSelected) {
      startLine = result.split('\n').length;
      result += `{SELECT_START}{Line-${startLine}-${pos}}`;
    }

    result += `\n\`\`\`${module}{`;

    let content = '';

    if (data) {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = data.replace(/^{|}$/g, '');
      }

      const json = typeof data === 'string' ? JSON.parse(data) : data;
      content = toYAML(json);
    }

    if (typeof tag === 'string' && tag.startsWith('{{')) {
      tag = tag.replace(/^{{/, '{').replace(/}}$/, '}');
    }

    const parsedTag = typeof tag === 'string' ? JSON.parse(tag) : tag;
    const newTag: Record<string, any> = {...parsedTag, ...customSettings};
    for (let prop in newTag) {
      if (newTag.hasOwnProperty(prop)) {
        if (typeof newTag[prop] === 'string' && newTag[prop].startsWith('{{')) {
          newTag[prop] = newTag[prop].trim();
          const value = newTag[prop].replace(/^{{/, '{').replace(/}}$/, '}');
          newTag[prop] = JSON.parse(value);
        }
      }
    }

    if (Object.keys(newTag).length > 0) {
      let partString = JSON.stringify(newTag, null, 2);
      partString = partString.replace(/^{|}$/g, '');
      result += `${partString}`;
    }

    if (value) {
      content = value.replace(/^'|'$/g, "").replace(/^"|"$/g, "");
    }
    result += `}\n${content || ''}\n\`\`\`\n`;

    if (isSelected) {
      endLine = result.split('\n').length - 1;
      result += `{SELECT_END}{Line-${endLine}-${pos}}`;
    }
  } else if (root.name == 'i-panel') {
    pos = 0;
  }

  if (root.items) {
    root.items.forEach((item, index) => {
      result = renderMd(item, result, positions, rootName === 'i-page-block' || rootName === 'i-page-group');
    });
  }

  return result.trim();
}
