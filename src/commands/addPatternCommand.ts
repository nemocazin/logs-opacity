import * as vscode from 'vscode';
import { getToggleFromConfig, saveCustomPattern } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';

type Languages = {
    label: string;
    languageId: string;
};

const LANGUAGES: Languages[] = [
    { label: 'General', languageId: 'general' },
    { label: 'Go', languageId: 'go' },
    { label: 'JavaScript', languageId: 'javascript' },
    { label: 'Typescript', languageId: 'typescript' },
    { label: 'C++', languageId: 'cpp' },
];

/**
 * Handles the command to add a custom pattern.
 */
export async function handleAddCustomPatternCommand(): Promise<void> {
    if (getToggleFromConfig() === false) {
        vscode.window.showInformationMessage('Please toggle on the extension before adding a custom pattern.');
        return;
    }

    // Get user input for language, name, and pattern
    const selectedLanguage = await promptForLanguage();
    const patternNameInput = await promptForName();
    const patternInput = await promptForPattern();

    // Save the custom pattern to the configuration if all inputs are provided
    if (selectedLanguage && patternNameInput && patternInput) {
        // Save the custom pattern to the configuration
        await saveCustomPattern(selectedLanguage, patternNameInput, patternInput);
        recreateDecoration();
        showAddPatternConfirmation(selectedLanguage, patternNameInput);
    }
}

/**
 * Prompts the user to select a language for the custom pattern.
 *
 * @returns The abbreviation of the selected language, or undefined if no selection was made.
 */
export async function promptForLanguage(): Promise<string | undefined> {
    const selectedOption = await vscode.window.showQuickPick(LANGUAGES, {
        placeHolder: 'Select a language for your custom pattern.',
        matchOnDescription: true,
    });
    return selectedOption?.languageId;
}

/**
 * Prompts the user to enter a name for the custom pattern.
 *
 * @returns The name entered by the user, or undefined if no input was provided.
 */
export async function promptForName(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter a name for your custom pattern.',
    });
}

/**
 * Prompts the user to enter a pattern to match log statements.
 *
 * @returns The pattern entered by the user, or undefined if no input was provided.
 */
export async function promptForPattern(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter a pattern to match log statements.',
    });
}

/**
 * Shows a confirmation message after successfully adding a custom pattern.
 *
 * @param language The language for which the custom pattern was added.
 * @param name The name of the custom pattern that was added.
 */
export function showAddPatternConfirmation(language: string, name: string): void {
    vscode.window.showInformationMessage(`Custom pattern "${name}" added for ${language}.`);
}
