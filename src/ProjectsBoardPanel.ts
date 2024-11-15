import * as vscode from 'vscode';
import { getNonce } from './utils';
import { GitHubService } from './services/githubService';

export class ProjectsBoardPanel {
  public static currentPanel: ProjectsBoardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private readonly _githubService: GitHubService;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, githubService: GitHubService) {
    this._panel = panel;
    this._githubService = githubService;
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'getColumns':
          try {
            const columns = await this._githubService.getProjectColumns(message.projectId);
            this._panel.webview.postMessage({ type: 'columns', columns });
          } catch (error) {
            vscode.window.showErrorMessage('Failed to fetch project columns');
          }
          break;
      }
    });
  }

  public static createOrShow(extensionUri: vscode.Uri, githubService: GitHubService, projectId?: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ProjectsBoardPanel.currentPanel) {
      ProjectsBoardPanel.currentPanel._panel.reveal(column);
      if (projectId) {
        ProjectsBoardPanel.currentPanel._panel.webview.postMessage({ 
          command: 'loadProject',
          projectId 
        });
      }
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'githubProjects',
      'GitHub Projects',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri]
      }
    );

    ProjectsBoardPanel.currentPanel = new ProjectsBoardPanel(panel, extensionUri, githubService);
    
    if (projectId) {
      ProjectsBoardPanel.currentPanel._panel.webview.postMessage({ 
        command: 'loadProject',
        projectId 
      });
    }
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const webviewUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js')
    );
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
        <title>GitHub Projects</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${webviewUri}"></script>
      </body>
      </html>
    `;
  }

  public dispose() {
    ProjectsBoardPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}