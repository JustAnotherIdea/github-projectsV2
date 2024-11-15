// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProjectsBoardViewProvider } from './ProjectsBoardViewProvider';
import { ProjectsBoardPanel } from './ProjectsBoardPanel';
import { GitHubService } from './services/githubService';
import { AuthService } from './services/authService';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	try {
		const authService = new AuthService(context);
		const token = await authService.getAccessToken();
		const githubService = new GitHubService(token);

		const sidebarProvider = new ProjectsBoardViewProvider(context.extensionUri, githubService);
		
		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				'github-projects-boards',
				sidebarProvider
			)
		);

		context.subscriptions.push(
			vscode.commands.registerCommand('github-projects.openBoard', (projectId: string) => {
				ProjectsBoardPanel.createOrShow(context.extensionUri, githubService, projectId);
			})
		);

		context.subscriptions.push(
			vscode.commands.registerCommand('github-projects.refreshBoards', () => {
				sidebarProvider.refresh();
			})
		);

		// Register configuration change handler
		context.subscriptions.push(
			vscode.workspace.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('githubProjects')) {
					vscode.commands.executeCommand('github-projects.refreshBoards');
				}
			})
		);

		// Add logout command
		context.subscriptions.push(
			vscode.commands.registerCommand('github-projects.logout', async () => {
				try {
					await authService.logout();
					vscode.window.showInformationMessage('Successfully signed out of GitHub');
					// Reload window to reset extension state
					await vscode.commands.executeCommand('workbench.action.reloadWindow');
				} catch (error) {
					vscode.window.showErrorMessage('Failed to sign out of GitHub');
				}
			})
		);
	} catch (error) {
		vscode.window.showErrorMessage('Failed to authenticate with GitHub. Please try again.');
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
