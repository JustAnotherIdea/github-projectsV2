import * as vscode from 'vscode';
import { getNonce } from './utils';
import { GitHubService } from './services/githubService';

export class ProjectsBoardViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _githubService: GitHubService
  ) {}

  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'getProjects':
          const org = vscode.workspace.getConfiguration().get<string>('githubProjects.organization');
          if (!org) {
            const orgName = await vscode.window.showInputBox({
              prompt: 'Enter your GitHub organization name',
              placeHolder: 'organization-name'
            });
            
            if (orgName) {
              await vscode.workspace.getConfiguration().update(
                'githubProjects.organization',
                orgName,
                vscode.ConfigurationTarget.Global
              );
              const projects = await this._githubService.getProjects(orgName);
              webviewView.webview.postMessage({ type: 'projects', projects });
            }
            return;
          }
          
          try {
            const projects = await this._githubService.getProjects(org);
            webviewView.webview.postMessage({ type: 'projects', projects });
          } catch (error) {
            vscode.window.showErrorMessage('Failed to fetch projects');
          }
          break;
        case 'openProject':
          vscode.commands.executeCommand('github-projects.openBoard', message.projectId);
          break;
      }
    });
  }

  public refresh() {
    if (this._view) {
      this._view.webview.postMessage({ command: 'refresh' });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const webviewUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js')
    );
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';">
        <title>GitHub Projects</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${webviewUri}"></script>
      </body>
      </html>
    `;
  }
}