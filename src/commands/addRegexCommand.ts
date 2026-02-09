import * as vscode from 'vscode';
import { getToggleFromConfig, saveCustomRegex } from '../config/configManager';
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
 * Handles the command to add a custom regex.
 */
export async function handleAddCustomRegexCommand(): Promise<void> {
    if (getToggleFromConfig() === false) {
        vscode.window.showInformationMessage('Please toggle on the extension before adding a custom regex.');
        return;
    }

    // Get user input for language, name, and regex pattern
    const selectedLanguage = await promptForLanguage();
    const regexNameInput = await promptForName();
    const regexPatternInput = await promptForRegex();

    // Save the custom regex to the configuration if all inputs are provided
    if (selectedLanguage && regexNameInput && regexPatternInput) {
        // Save the custom regex to the configuration
        await saveCustomRegex(selectedLanguage, regexNameInput, regexPatternInput);
        recreateDecoration();
        showAddRegexConfirmation(selectedLanguage, regexNameInput);
    }
}

/**
 * Prompts the user to select a language for the custom regex.
 *
 * @returns The abbreviation of the selected language, or undefined if no selection was made.
 */
export async function promptForLanguage(): Promise<string | undefined> {
    const selectedOption = await vscode.window.showQuickPick(LANGUAGES, {
        placeHolder: 'Select a language for your custom regex.',
        matchOnDescription: true,
    });
    return selectedOption?.languageId;
}

/**
 * Prompts the user to enter a name for the custom regex.
 *
 * @returns The name entered by the user, or undefined if no input was provided.
 */
export async function promptForName(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter a name for your custom regex.',
    });
}

/**
 * Prompts the user to enter a regex pattern to match log statements.
 *
 * @returns The regex pattern entered by the user, or undefined if no input was provided.
 */
export async function promptForRegex(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter regex pattern to match log statements.',
    });
}

/**
 * Shows a confirmation message after successfully adding a custom regex.
 *
 * @param language The language for which the custom regex was added.
 * @param name The name of the custom regex that was added.
 */
export function showAddRegexConfirmation(language: string, name: string): void {
    vscode.window.showInformationMessage(`Custom regex "${name}" added for ${language}.`);
}
