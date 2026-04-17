import * as vscode from 'vscode';
import { createDecoration, disposeDecoration } from './core/decoration';
import { initializeDecorations } from './core/decorationUpdater';
import { registerCommands } from './commands/commandRegistry';

export function activate(context: vscode.ExtensionContext) {
    createDecoration();
    initializeDecorations();
    registerCommands(context);
}

export function deactivate() {
    disposeDecoration();
}
