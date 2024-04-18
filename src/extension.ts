import * as vscode from 'vscode';

let fileCache: vscode.Uri[] = [];
let currentGlobPattern = '';
let currentExcludePattern = '';

async function getFiles(forceRefresh = false) {
  const config = vscode.workspace.getConfiguration('coderoulette');
  const globPattern = config.get<string>('globPattern', '**/*');
  const excludePattern = config.get<string>('excludePattern', '');

  if (forceRefresh || globPattern !== currentGlobPattern || excludePattern !== currentExcludePattern) {
    currentGlobPattern = globPattern;
    currentExcludePattern = excludePattern;
    fileCache = await vscode.workspace.findFiles(globPattern, excludePattern);
  }

  return { files: fileCache, globPattern, excludePattern };
}

export function activate(context: vscode.ExtensionContext) {
  let openRandomFileDisposable = vscode.commands.registerCommand('coderoulette.openRandomFile', async () => {
    const { files, globPattern, excludePattern } = await getFiles();
    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const document = await vscode.workspace.openTextDocument(randomFile);
      await vscode.window.showTextDocument(document);
    } else {
      let msg: string;
      if (excludePattern) {
        msg = `No files found matching the pattern: ${globPattern} (excluding: ${excludePattern})`;
      } else {
        msg = `No files found matching the pattern: ${globPattern}`;
      }
      vscode.window.showInformationMessage(msg);
    }
  });
  context.subscriptions.push(openRandomFileDisposable);

  let updateFileCacheDisposable = vscode.commands.registerCommand('coderoulette.updateFileCache', async () => {
    await getFiles(true);
    vscode.window.showInformationMessage('File cache updated.');
  });
  context.subscriptions.push(updateFileCacheDisposable);
}

export function deactivate() { }
