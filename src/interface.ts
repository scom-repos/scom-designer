import { Parser } from "@ijstech/compiler";
import { Control, IconName } from "@ijstech/components";
import { ScomDesignerForm } from "./designer";

export interface IStudio {
  addEventHandler(designer: ScomDesignerForm, eventName: string, funcName: string): void;
  locateMethod(designer: ScomDesignerForm, funcName: string): void;
  removeComponent(designer: ScomDesignerForm): void;
  renameComponent(designer: ScomDesignerForm, oldId: string, newId: string): boolean;
  renameEventHandler(designer: ScomDesignerForm, funcName: string, newFuncName: string): boolean;
  registerWidget(designer: ScomDesignerForm, name: string, type: string): void;
}

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
  icon?: IconName;
  category?: string;
  parent?: string;
  repeater?: string;
  isShown?: boolean;
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

export type onChangedCallback = (prop: string, value: string|number|boolean|object, mediaQueryProp?: string) => void;

export type onUpdateCallback = (isChecked: boolean, props: string[]) => void;

export type onEventChangedCallback = (prop: string, newValue: string, oldValue: string) => void;

export type onEventDblClickCallback = (funcName: string) => void;

export interface IFileHandler {
  openFile(file: IIPFSData, parentCid: string, parent: Control, config: any): Promise<void>;
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

export interface IMediaQuery {
  minWidth: string;
  maxWidth?: string;
  properties: any;
}
