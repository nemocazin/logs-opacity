import * as vscode from 'vscode';
import { deleteCustomPattern, getAllCustomPatterns } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';

/**
 * Handles the command to delete a custom pattern.
 */
export async function handleDeleteCustomPatternCommand(): Promise<void> {
    // Get the list of custom pattern names
    const patternsNamesList = getAllCustomPatterns().map(pattern => pattern.name);
    if (patternsNamesList.length === 0) {
        vscode.window.showInformationMessage('No custom patterns found to delete.');
        return;
    }

    const nameInput = await promptForName(patternsNamesList);

    if (nameInput) {
        // Delete the custom pattern from the configuration
        await deleteCustomPattern(nameInput);
        recreateDecoration();
        showDeletePatternConfirmation(nameInput);
    }
}

/**
 * Prompts the user to select a custom pattern to delete.
 *
 * @param patternsNamesList An array of custom pattern names to display in the quick pick.
 * @returns The name of the custom pattern selected by the user, or undefined if no selection was made.
 */
export async function promptForName(patternsNamesList: string[]): Promise<string | undefined> {
    return vscode.window.showQuickPick(patternsNamesList, {
        placeHolder: 'Select a custom pattern to delete.',
    });
}

/**
 * Shows a confirmation message after successfully deleting a custom pattern.
 *
 * @param name The name of the custom pattern that was deleted.
 */
export function showDeletePatternConfirmation(name: string): void {
    vscode.window.showInformationMessage(`Custom pattern "${name}" deleted.`);
}
