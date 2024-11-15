import * as vscode from 'vscode';

export class AuthService {
  private static readonly GITHUB_AUTH_PROVIDER = 'github';
  private static readonly SCOPES = ['read:org', 'project'];

  constructor(private context: vscode.ExtensionContext) {}

  async getAccessToken(): Promise<string> {
    try {
      const session = await vscode.authentication.getSession(
        AuthService.GITHUB_AUTH_PROVIDER,
        AuthService.SCOPES,
        { createIfNone: true }
      );

      if (!session) {
        throw new Error('Failed to get GitHub session');
      }

      return session.accessToken;
    } catch (error) {
      vscode.window.showErrorMessage('Failed to authenticate with GitHub');
      throw error;
    }
  }

  async logout(): Promise<void> {
    await vscode.authentication.getSession(
      AuthService.GITHUB_AUTH_PROVIDER,
      AuthService.SCOPES,
      { createIfNone: false }
    );
  }
}