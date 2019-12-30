import * as vscode from 'vscode';

import { IndexTreeProvider } from './lib/IndexTreeProvider';
import OpenMindmapAsJSONProvider from './lib/OpenMindmapAsJSONProvider';

const activate = (context: vscode.ExtensionContext) => {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('MRI 插件已激活！');

	// 构建索引树
	buildIndexTree(context);

	// 实现命令调用
	registerCommands(context);

	// 注册虚拟文档
	registerDocument(context);

	// 一些参考代码，暂时先不删
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });

	// context.subscriptions.push(disposable);
};

const buildIndexTree = (context: vscode.ExtensionContext) => {
	let d = vscode.window.registerTreeDataProvider('indexTree', new IndexTreeProvider());
	context.subscriptions.push(d);
};

const registerCommands = (context: vscode.ExtensionContext) => {
	// 打开导图预览
	let d1 = vscode.commands.registerCommand('indexTree.openProcessonView', (treeItem: { viewLink: string }) => {
		console.log('indexTree.openProcessonView', treeItem.viewLink);

		if (treeItem.viewLink) {
			vscode.env.openExternal(vscode.Uri.parse(treeItem.viewLink));
		}
	});

	// 打开导图编辑
	let d2 = vscode.commands.registerCommand('indexTree.openProcessonEdit', (treeItem: { editLink: string }) => {
		console.log('indexTree.openProcessonEdit', treeItem.editLink);

		if (treeItem.editLink) {
			vscode.env.openExternal(vscode.Uri.parse(treeItem.editLink));
		}
	});

	// 打开 JSON 在线编辑
	let d3 = vscode.commands.registerCommand('indexTree.openJSON', async (treeItem: { viewLink: string }) => {
		if (treeItem.viewLink) {
			// let url = `http://mritools.sibbay.ai/v2export?mapurl=${treeItem.viewLink}`;
			// vscode.env.openExternal(vscode.Uri.parse(url));

			let what = treeItem.viewLink;
			let uri = vscode.Uri.parse('sibbay-open-map:' + what);
			let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider

			let options: Object = {
				language: "json"
			};

			await vscode.workspace.openTextDocument(options);
			// await vscode.window.showTextDocument(doc, { 
			// 	preview: false
			// });
			await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);

			
			// await vscode.workspace.openTextDocument(options).then(doc => {
			// 	vscode.window.showTextDocument(doc);
			// }, err => {
			// 	vscode.window.showErrorMessage(err);
			// });
		}
	});

	context.subscriptions.push(d1);
	context.subscriptions.push(d2);
	context.subscriptions.push(d3);
};

const registerDocument = (context: vscode.ExtensionContext) => {
	let d1 = vscode.workspace.registerTextDocumentContentProvider('sibbay-open-map', new OpenMindmapAsJSONProvider());

	let d2 = vscode.commands.registerCommand('sibbay.open.mri.json.from.map', async () => {
		let what = await vscode.window.showInputBox({ prompt: '请输入思维导图预览地址', placeHolder: 'https://www.processon.com/view/link/...' });
		if (what) {
			let uri = vscode.Uri.parse('sibbay-open-map:' + what);
			let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
			await vscode.window.showTextDocument(doc, { 
				preview: false
			});
		}
	});

	context.subscriptions.push(d1);
	context.subscriptions.push(d2);

	// vscode.workspace.onDidOpenTextDocument(document => {
	// 	console.log(document);
	// });
};

const deactivate = () => {};

export {
	activate, deactivate
};