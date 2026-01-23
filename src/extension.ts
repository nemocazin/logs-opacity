import * as vscode from 'vscode';
import { createDecoration, disposeDecoration } from './core/decoration';
import { initializeDecorations } from './core/decorationUpdater';
import { registerCommands } from './commands/commandRegistry';
import { registerEventListeners } from './events/eventListeners';

export function activate(context: vscode.ExtensionContext) {
    createDecoration();
    initializeDecorations();
    registerCommands(context);
    registerEventListeners(context);
}

export function deactivate() {
    disposeDecoration();
}
