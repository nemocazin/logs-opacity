import * as vscode from 'vscode';
import { logDecoration } from './decoration';
import { findLogStatements } from './../detectors/logDetector';

/**
 * Updates decorations in the given editor.
 *
 * @param editor The text editor to update decorations for.
 */
export function updateDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor) return;

    const logRanges = findLogStatements(editor);
    editor.setDecorations(logDecoration, logRanges);
}

/**
 * Updates decorations in all visible text editors.
 */
export function updateAllVisibleEditors(): void {
    vscode.window.visibleTextEditors.forEach(editor => updateDecorations(editor));
}

/**
 * Initializes decorations for the active text editor.
 */
export function initializeDecorations(): void {
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }
}
