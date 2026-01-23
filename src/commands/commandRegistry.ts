import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from './changeOpacityCommand';

/**
 * Registers all commands for the extension.
 *
 * @param context The extension context to register commands in.
 */
export function registerCommands(context: vscode.ExtensionContext): void {
    const changeOpacityCommand = vscode.commands.registerCommand(
        'logs-opacity.changeOpacity',
        handleChangeOpacityCommand,
    );

    context.subscriptions.push(changeOpacityCommand);
}
