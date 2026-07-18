import * as vscode from 'vscode';
import { getOpacityFromConfig, getColorFromConfig } from '../config/configManager';
import { convertOpacityToHex } from '../utils/converter';
import { updateAllVisibleEditors } from './decorationUpdater';

export let logDecoration: vscode.TextEditorDecorationType;

/**
 * Recreates the decoration type by disposing of the old one and creating a new one.
 */
export function recreateDecoration(): void {
    disposeDecoration();
    createDecoration();
    updateAllVisibleEditors();
}

/**
 * Disposes of the existing decoration type.
 */
export function disposeDecoration(): void {
    if (logDecoration) {
        logDecoration.dispose();
    }
}

/**
 * Creates the decoration type for log statements based on the configured opacity.
 */
export function createDecoration(): void {
    const opacity: number = getOpacityFromConfig();
    const color: string = getColorFromConfig();

    // If default color is specified, only opacity is used.
    if (color === 'default') {
        logDecoration = vscode.window.createTextEditorDecorationType({
            opacity: (opacity / 100).toString(),
            fontStyle: 'italic',
        });
    } else {
        // Otherwise, apply the color with opacity.
        const alphaHex = convertOpacityToHex(opacity);
        logDecoration = vscode.window.createTextEditorDecorationType({
            color: `${color}${alphaHex}`,
            fontStyle: 'italic',
        });
    }
}
