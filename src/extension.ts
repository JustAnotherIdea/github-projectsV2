// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProjectsBoardViewProvider } from './ProjectsBoardViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new ProjectsBoardViewProvider(context.extensionUri);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'github-projects-boards',
			provider
		)
	);

	const disposable = vscode.commands.registerCommand('github-projects.openBoard', () => {
		vscode.commands.executeCommand('github-projects-boards.focus');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}