import * as vscode from 'vscode';
import { getNonce } from './utils';

export class ProjectsBoardPanel {
  public static currentPanel: ProjectsBoardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ProjectsBoardPanel.currentPanel) {
      ProjectsBoardPanel.currentPanel._panel.reveal(column);
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

    ProjectsBoardPanel.currentPanel = new ProjectsBoardPanel(panel, extensionUri);
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