import * as vscode from 'vscode';

import { IndexTreeProvider } from './lib/IndexTreeProvider';

const activate = (context: vscode.ExtensionContext) => {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('MRI 插件已激活！');

	// 构建索引树
	vscode.window.registerTreeDataProvider('indexTree', new IndexTreeProvider());

	// 实现命令调用
	context.subscriptions.push(vscode.commands.registerCommand('indexTree.openProcessonView', (treeItem: { viewLink: string, editLink: string }) => {
		console.log('indexTree.openProcessonView', treeItem.viewLink);

		if (treeItem.viewLink) {
			vscode.env.openExternal(vscode.Uri.parse(treeItem.viewLink));
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('indexTree.openProcessonEdit', (treeItem: { viewLink: string, editLink: string }) => {
		console.log('indexTree.openProcessonEdit', treeItem.editLink);

		if (treeItem.editLink) {
			vscode.env.openExternal(vscode.Uri.parse(treeItem.editLink));
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('indexTree.openJSON', (treeItem: { viewLink: string, editLink: string }) => {
		if (treeItem.viewLink) {
			let url = `http://mritools.sibbay.ai/v2export?mapurl=${treeItem.viewLink}`;
			vscode.env.openExternal(vscode.Uri.parse(url));
		}
	}));

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });

	// context.subscriptions.push(disposable);
}

const deactivate = () => {}

export {
	activate, deactivate
};