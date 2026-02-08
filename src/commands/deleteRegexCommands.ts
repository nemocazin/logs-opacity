import * as vscode from 'vscode';
import { deleteCustomRegex, getAllCustomRegexes, getToggleFromConfig } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';

/**
 * Handles the command to delete a custom regex.
 */
export async function handleDeleteCustomRegexCommand(): Promise<void> {
    if (getToggleFromConfig() === false) {
        vscode.window.showInformationMessage('Please toggle on the extension before deleting a custom regex.');
        return;
    }

    // Get the list of custom regex names
    const regexesNamesList = getAllCustomRegexes().map(regex => regex.name);
    if (regexesNamesList.length === 0) {
        vscode.window.showInformationMessage('No custom regexes found to delete.');
        return;
    }

    const nameInput = await promptForName(regexesNamesList);

    if (nameInput) {
        // Delete the custom regex from the configuration
        await deleteCustomRegex(nameInput);
        recreateDecoration();
        showDeleteRegexConfirmation(nameInput);
    }
}

/**
 * Prompts the user to select a custom regex to delete.
 *
 * @param regexesNamesList An array of custom regex names to display in the quick pick.
 * @returns The name of the custom regex selected by the user, or undefined if no selection was made.
 */
export async function promptForName(regexesNamesList: string[]): Promise<string | undefined> {
    return vscode.window.showQuickPick(regexesNamesList, {
        placeHolder: 'Select a custom regex to delete.',
    });
}

/**
 * Shows a confirmation message after successfully deleting a custom regex.
 *
 * @param name The name of the custom regex that was deleted.
 */
export function showDeleteRegexConfirmation(name: string): void {
    vscode.window.showInformationMessage(`Custom regex "${name}" deleted.`);
}
