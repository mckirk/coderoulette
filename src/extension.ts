// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
let fileCache = [];
let currentGlobPattern = '';

export function activate(context: vscode.ExtensionContext) {
  let openRandomFileDisposable = vscode.commands.registerCommand('coderoulette.openRandomFile', async () => {
    const config = vscode.workspace.getConfiguration('coderoulette');
    const globPattern = config.get<string>('randomFileGlob', '**/*');
    if (globPattern !== currentGlobPattern) {
      await updateFileCache(globPattern);
    }
    const files = await vscode.workspace.findFiles(globPattern);
    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const document = await vscode.workspace.openTextDocument(randomFile);
      await vscode.window.showTextDocument(document);
    } else {
      vscode.window.showInformationMessage('No files found matching the pattern: ' + globPattern);
    }
  });

  context.subscriptions.push(openRandomFileDisposable);
  let updateFileCacheDisposable = vscode.commands.registerCommand('coderoulette.updateFileCache', async () => {
    const config = vscode.workspace.getConfiguration('coderoulette');
    const globPattern = config.get<string>('randomFileGlob', '**/*');
    await updateFileCache(globPattern);
    vscode.window.showInformationMessage('File cache updated.');
  });
  context.subscriptions.push(updateFileCacheDisposable);
}

async function updateFileCache(globPattern) {
  currentGlobPattern = globPattern;
  fileCache = await vscode.workspace.findFiles(globPattern);
}

// This method is called when your extension is deactivated
export function deactivate() {}
