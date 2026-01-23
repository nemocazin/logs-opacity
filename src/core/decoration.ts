import * as vscode from 'vscode';
import { getOpacityFromConfig } from '../config/configManager';
import { convertOpacityToHex } from '../utils/converter';

export let logDecoration: vscode.TextEditorDecorationType;

/**
 * Creates the decoration type for log statements based on the configured opacity.
 */
export function createDecoration(): void {
    const opacity: number = getOpacityFromConfig();

    // Opacity 100% means no change, so use default styling
    if (opacity === 100) {
        logDecoration = vscode.window.createTextEditorDecorationType({});
        return;
    }

    const alphaHex = convertOpacityToHex(opacity);

    logDecoration = vscode.window.createTextEditorDecorationType({
        color: `#808080${alphaHex}`,
        fontStyle: 'italic',
    });
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
 * Recreates the decoration type by disposing of the old one and creating a new one.
 */
export function recreateDecoration(): void {
    disposeDecoration();
    createDecoration();
}
