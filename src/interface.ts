import { Parser } from "@ijstech/compiler";
import { Control, IconName } from "@ijstech/components";

export interface IScreen {
  id: string;
  name: string;
  elements: IComponent[];
  isHidden?: boolean;
  isDeleted?: boolean;
}

export interface IComponentPicker {
  name: string;
  tooltipText?: string;
  items: IComponentItem[];
}

export interface IComponentItem extends Parser.IComponent {
  path: string;
  name: string;
  image?: string;
  iconName?: IconName;
  category?: string;
}

export interface IComponent extends IComponentItem {
  items?: IComponent[];
}

export interface IBlock {
  id: string;
  path: string;
  caption: string;
  image: string;
}

export interface IControl extends IComponent {
  control: Control;
}

export type onChangedCallback = (prop: string, value: string|number|boolean|object) => void;

export interface IFileHandler {
  openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control): Promise<void>;
}

export interface IIPFSData {
  cid: string;
  name?: string;
  size?: number;
  type?: string | 'dir' | 'file';
  links?: IIPFSData[];
  path?: string;
  sort?: 'asc' | 'desc';
  root?: boolean;
}
