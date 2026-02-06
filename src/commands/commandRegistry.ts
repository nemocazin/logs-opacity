import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from './changeOpacityCommand';
import { handleChangeColorCommand } from './changeColorCommand';
import { handleToggleCommand } from './toggleCommand';

/**
 * Registers all commands for the extension.
 *
 * @param context The extension context to register commands in.
 */
export function registerCommands(context: vscode.ExtensionContext): void {
    const toggleCommand = vscode.commands.registerCommand('unobtrusive-logs.toggle', handleToggleCommand);

    const changeOpacityCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.changeOpacity',
        handleChangeOpacityCommand,
    );

    const changeColorCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.changeColor',
        handleChangeColorCommand,
    );

    context.subscriptions.push(toggleCommand);
    context.subscriptions.push(changeOpacityCommand);
    context.subscriptions.push(changeColorCommand);
}
