import * as vscode from 'vscode';
import { saveColorToConfig } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';
import { updateAllVisibleEditors } from '../core/decorationUpdater';

type ColorOption = {
    label: string;
    description: string;
    hexCode: string;
}

const COLOR_OPTIONS: ColorOption[] = [
    { label: '⬛ Default', description: '', hexCode: '#808080' },
    { label: '🟥 Red', description: '', hexCode: '#FF0000' },
    { label: '🟩 Green', description: '', hexCode: '#00FF00' },
    { label: '🟦 Blue', description: '', hexCode: '#0000FF' },
    { label: '🟨 Yellow', description: '', hexCode: '#FFFF00' },
    { label: '🟪 Purple', description: '', hexCode: '#9B59B6' },
    { label: '🟧 Orange', description: '', hexCode: '#FFA500' },
    { label: '🟫 Brown', description: '', hexCode: '#8B4513' },
    { label: '🟦 Cyan', description: '', hexCode: '#00FFFF' },
    { label: '🟪 Pink', description: '', hexCode: '#FF69B4' },
    { label: '🟥 Crimson', description: '', hexCode: '#DC143C' },
    { label: '🟩 Lime', description: '', hexCode: '#32CD32' },
    { label: '🟦 Navy', description: '', hexCode: '#000080' },
    { label: '🟨 Gold', description: '', hexCode: '#FFD700' },
    { label: '🟪 Magenta', description: '', hexCode: '#FF00FF' },
    { label: '🟧 Coral', description: '', hexCode: '#FF7F50' },
    { label: '🟫 Chocolate', description: '', hexCode: '#D2691E' },
    { label: '⬛ Silver', description: '', hexCode: '#C0C0C0' },
    { label: '🟦 Teal', description: '', hexCode: '#008080' },
    { label: '🟪 Lavender', description: '', hexCode: '#E6E6FA' },
    { label: '🟥 Maroon', description: '', hexCode: '#800000' },
    { label: '🟩 Olive', description: '', hexCode: '#808000' },
    { label: '🟦 Indigo', description: '', hexCode: '#4B0082' },
    { label: '🟨 Khaki', description: '', hexCode: '#F0E68C' },
    { label: '🟪 Plum', description: '', hexCode: '#DDA0DD' },
    { label: '🟧 Peach', description: '', hexCode: '#FFDAB9' },
    { label: '🟫 Tan', description: '', hexCode: '#D2B48C' },
    { label: '⬛ Charcoal', description: '', hexCode: '#36454F' },
    { label: '🟦 Turquoise', description: '', hexCode: '#40E0D0' },
    { label: '🟪 Orchid', description: '', hexCode: '#DA70D6' },
];

/**
 * Handles the command to change the color of log statements.
 */
export async function handleChangeColorCommand(): Promise<void> {
    const selectedColor = await promptForColor();

    if (selectedColor) {
        await saveColorToConfig(selectedColor);
        recreateDecoration();
        updateAllVisibleEditors();
        showColorConfirmation(selectedColor);
    }
}

/**
 * Prompts the user to select a color from a list of options.
 *
 * @returns The selected color's hex code, or undefined if the selection was canceled.
 */
async function promptForColor(): Promise<string | undefined> {
    const selectedOption = await vscode.window.showQuickPick(COLOR_OPTIONS, {
        placeHolder: 'Select a color for logs',
        matchOnDescription: true,
    });

    return selectedOption?.hexCode;
}

/**
 * Shows a confirmation message to the user about the new color setting.
 *
 * @param hexCode The new color hex code.
 */
function showColorConfirmation(hexCode: string): void {
    const colorName = COLOR_OPTIONS.find(opt => opt.hexCode === hexCode)?.label || hexCode;
    vscode.window.showInformationMessage(`Log color set to ${colorName}`);
}