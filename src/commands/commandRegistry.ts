import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from './changeOpacityCommand';
import { handleChangeColorCommand } from './changeColorCommand';
import { handleToggleCommand } from './toggleCommand';
import { handleAddCustomRegexCommand } from './addRegexCommand';
import { handleDeleteCustomRegexCommand } from './deleteRegexCommands';

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

    const addCustomRegexCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.addCustomRegex',
        handleAddCustomRegexCommand,
    );

    const deleteCustomRegexCommand = vscode.commands.registerCommand(
        'unobtrusive-logs.deleteCustomRegex',
        handleDeleteCustomRegexCommand,
    );

    context.subscriptions.push(toggleCommand);
    context.subscriptions.push(changeOpacityCommand);
    context.subscriptions.push(changeColorCommand);
    context.subscriptions.push(addCustomRegexCommand);
    context.subscriptions.push(deleteCustomRegexCommand);
}
