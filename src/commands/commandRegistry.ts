import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from './changeOpacityCommand';
import { handleChangeColorCommand } from './changeColorCommand';
import { handleToggleCommand } from './toggleCommand';
import { handleAddCustomPatternCommand } from './addPatternCommand';
import { handleDeleteCustomPatternCommand } from './deletePatternCommands';

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

    const addCustomPatternCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.addCustomPattern',
        handleAddCustomPatternCommand,
    );

    const deleteCustomPatternCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.deleteCustomPattern',
        handleDeleteCustomPatternCommand,
    );

    context.subscriptions.push(toggleCommand);
    context.subscriptions.push(changeOpacityCommand);
    context.subscriptions.push(changeColorCommand);
    context.subscriptions.push(addCustomPatternCommand);
    context.subscriptions.push(deleteCustomPatternCommand);
}
