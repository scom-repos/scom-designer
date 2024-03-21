import { IconName } from "@ijstech/components";

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

export interface IComponentItem {
  path: string;
  caption: string; // name
  image?: string;
  iconName?: IconName;
  category?: string;
}

export interface IComponent extends IComponentItem {
  children?: IComponent[]
}

export interface IBlock {
  id: string;
  path: string;
  caption: string;
  image: string;
}