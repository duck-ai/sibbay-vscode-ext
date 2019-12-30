import * as vscode from 'vscode';

import getJSON from '../api/map2mrijson';

export default class implements vscode.TextDocumentContentProvider {

  // emitter and its event
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    // simply invoke cowsay, use uri-path as text
    // return cowsay.say({ text: uri.path });
    console.log(`思维导图地址：${ uri }`);
    // sample: https://www.processon.com/view/link/5cf769a5e4b0123c616f4972
    
    let data = await getJSON({ mapurl: `${uri.path}` });
    console.log(data);

    return JSON.stringify(data, null, 2);
  }
}