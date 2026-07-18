import * as vscode from 'vscode';
import { saveColorToConfig } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';

type ColorOption = {
    label: string;
    hexCode: string;
};

const COLOR_OPTIONS: ColorOption[] = [
    { label: '🎨 Default', hexCode: 'default' },
    { label: '⬛ Grey', hexCode: '#808080' },
    { label: '🟥 Red', hexCode: '#FF0000' },
    { label: '🟩 Green', hexCode: '#00FF00' },
    { label: '🟦 Blue', hexCode: '#0000FF' },
    { label: '🟨 Yellow', hexCode: '#FFFF00' },
    { label: '🟪 Purple', hexCode: '#9B59B6' },
    { label: '🟧 Orange', hexCode: '#FFA500' },
    { label: '🟫 Brown', hexCode: '#8B4513' },
    { label: '🟦 Cyan', hexCode: '#00FFFF' },
    { label: '🟪 Pink', hexCode: '#FF69B4' },
    { label: '🟥 Crimson', hexCode: '#DC143C' },
    { label: '🟩 Lime', hexCode: '#32CD32' },
    { label: '🟦 Navy', hexCode: '#000080' },
    { label: '🟨 Gold', hexCode: '#FFD700' },
    { label: '🟪 Magenta', hexCode: '#FF00FF' },
    { label: '🟧 Coral', hexCode: '#FF7F50' },
    { label: '🟫 Chocolate', hexCode: '#D2691E' },
    { label: '⬛ Silver', hexCode: '#C0C0C0' },
    { label: '🟦 Teal', hexCode: '#008080' },
    { label: '🟪 Lavender', hexCode: '#E6E6FA' },
    { label: '🟥 Maroon', hexCode: '#800000' },
    { label: '🟩 Olive', hexCode: '#808000' },
    { label: '🟦 Indigo', hexCode: '#4B0082' },
    { label: '🟨 Khaki', hexCode: '#F0E68C' },
    { label: '🟪 Plum', hexCode: '#DDA0DD' },
    { label: '🟧 Peach', hexCode: '#FFDAB9' },
    { label: '🟫 Tan', hexCode: '#D2B48C' },
    { label: '⬛ Charcoal', hexCode: '#36454F' },
    { label: '🟦 Turquoise', hexCode: '#40E0D0' },
    { label: '🟪 Orchid', hexCode: '#DA70D6' },
];

/**
 * Handles the command to change the color of log statements.
 */
export async function handleChangeColorCommand(): Promise<void> {
    const selectedColor = await promptForColor();

    if (selectedColor) {
        await saveColorToConfig(selectedColor);
        recreateDecoration();
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
