// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executedimport * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "coderoulette" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('coderoulette.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from coderoulette!');
	});

	context.subscriptions.push(disposable);
  let openRandomFileDisposable = vscode.commands.registerCommand('coderoulette.openRandomFile', async () => {
    const config = vscode.workspace.getConfiguration('coderoulette');
    const globPattern = config.get<string>('randomFileGlob', '**/*');
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
}

// This method is called when your extension is deactivated
export function deactivate() {}
