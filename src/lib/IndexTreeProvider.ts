import * as vscode from 'vscode';
import * as path from 'path';

import papi from '../api/processon';

export class IndexTreeProvider implements vscode.TreeDataProvider<IndexTreeItem> {
  // onDidChangeTreeData?: vscode.Event<IndexTreeItem | null | undefined> | undefined;

  data: IndexTreeItem[];
  public indexMapData: object | undefined;

  constructor() {
    // this.data = [
    //   new IndexTreeItem('Ford',[
    //     new IndexTreeItem('Fiesta'),
    //     new IndexTreeItem('Focus'),
    //     new IndexTreeItem('Mustang'),
    //   ]),
    //   new IndexTreeItem('BMW',[
    //     new IndexTreeItem('320'),
    //     new IndexTreeItem('X3'),
    //     new IndexTreeItem('X5'),
    //   ]),
    // ];

    this.data = [];
  }

  getTreeItem(element: IndexTreeItem) {
    return element;
  }

  async getChildren(element?: IndexTreeItem | undefined) {
    if (!this.indexMapData) {
      await this.getIndexMapData();
      console.log(this.indexMapData);
    }

    if (element === undefined) {
      return this.data;
    }

    return element.children;
  }

  async getIndexMapData () {
    this.indexMapData = await new MindmapIndex().getData();

    // 遍历并构建索引树
    this.data = [ this._r(this.indexMapData) ];
    console.log(this.data);
  }

  _r (mNode: any) {
    let label = mNode.title;
    let children = mNode.children
      .filter((x: { children: [] }) => {
        return this.willBeShow(x);
      })
      .map((x: object) => {
        return this._r(x);
      });
    let isMRIMapNode = mNode.icons && mNode.icons.length;
    let item = new IndexTreeItem(label, children, isMRIMapNode, mNode);
    return item;
  }

  willBeShow (mNode: any): boolean {
    let { icons } = mNode;
    return mNode.children.length > 0 ||
      (
        icons && icons.length &&
        (
          icons[0].index === '38' || icons[0].index === '24'
        )
      );
  }
}

class IndexTreeItem extends vscode.TreeItem {
  children: IndexTreeItem[] | undefined;
  viewLink: string | undefined;
  editLink: string | undefined;

  constructor(label: string, children: IndexTreeItem[], isMRIMapNode: boolean, mNode: any) {
    super(
      label, 
      children.length === 0 ? 
        vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Collapsed,
    );

    this.children = children;

    if (isMRIMapNode) {
      this.iconPath = path.join(__dirname, '..', '..', 'icons', 'leaf.svg');
      this.contextValue = 'MRIMapNode';
      this.setLinks(mNode);
    }
  }

  setLinks (mNode: any) {
    let note = mNode.note || '';

    let viewMatch = note.match(/\[view\]\((.+)\)/);
    let editMatch = note.match(/\[edit\]\((.+)\)/);

    if (viewMatch) {
      this.viewLink = viewMatch[1];
    }

    if (editMatch) {
      this.editLink = editMatch[1];
    }
  }
}

class MindmapIndex {
  constructor () {}

  public async getData () {
    let $papi = new papi();
    return await $papi.getMindmapJSON({ mapurl: 'https://www.processon.com/view/link/5d1c5ee1e4b0316252cd8eb8' });
  }
}