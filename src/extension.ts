import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('extension.addCurrentFileExportationToIndex', () => {
        vscode.window.showInformationMessage('foo');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
