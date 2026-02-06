import * as vscode from 'vscode';
import { getToggleFromConfig, saveToggleToConfig } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';

/**
 * Handles the command to toggle extension on/off
 */
export async function handleToggleCommand(): Promise<void> {
    const currentToggle = getToggleFromConfig();
    const newToggle = !currentToggle;
    await saveToggleToConfig(newToggle);
    recreateDecoration();
    showToggleStatusMessage(newToggle);
}

function showToggleStatusMessage(isEnabled: boolean): void {
    const message = isEnabled ? 'Unobtrusive Logs is now enabled.' : 'Unobtrusive Logs is now disabled.';
    vscode.window.showInformationMessage(message);
}
