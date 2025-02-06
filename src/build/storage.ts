import { Types } from '@ijstech/compiler';
import { IFileData } from '../interface';

export class Storage implements Types.IStorage {
  public rootPath: string;
  private _data: IFileData = {
    path: '',
    content: ''
  };

  copied: { [packName: string]: boolean } = {};

  set data(value: IFileData) {
    this._data = value;
  }

  get data(): IFileData {
    return this._data;
  }

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  };

  async cidToSri(value: string): Promise<string> {
    return value;
    
  }

  async copyAssets(sourceDir: string, targetDir: string): Promise<void> {
  }

  async copyPackage(packName: string, targetDir: string, packages?: string[]): Promise<any> {
    return {};
  }

  async getSCConfig(): Promise<any> {
  }

  async getPackage(packName: string): Promise<any> {
    return {};
  }

  async getPackageConfig(): Promise<any> {
    return {};
  }

  async getPackageTypes(packName: string): Promise<Types.IPackage> {
    return {};
  }

  async getFiles(dir: string): Promise<{
    [filePath: string]: string;
  }> {
    return {};
  }

  async hashContent(dir: string): Promise<string> {
    return '';
  }

  async hashDir(dir: string): Promise<Types.ICidInfo> {
    return {
      cid: '',
      links: [],
      name: '',
      type: 'dir',
      size: 0
    };
  }

  async isDirectory(dir: string): Promise<boolean> {
    return false;
  }

  async isFile(filePath: string): Promise<boolean> {
    return true;
  }

  async isFileExists(filePath: string): Promise<boolean> {
    return false;
  }

  async readDir(dir: string): Promise<string[]> {
    return [];
  }

  async readFile(fileName: string): Promise<string> {
    return this._data.content || '';
  }

  async rename(oldPath: string, newPath: string): Promise<void> {

  }

  async writeFile(fileName: string, content: string): Promise<void> {
    this._data.content = content;
  }
}