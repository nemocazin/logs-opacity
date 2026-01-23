import * as vscode from 'vscode';

/**
 * Retrieves the opacity setting from the configuration.
 *
 * @returns The opacity value between 0 and 100.
 */
export function getOpacityFromConfig(): number {
    const config = vscode.workspace.getConfiguration('logsOpacity');
    return config.get<number>('opacity', 50);
}

/**
 * Saves the opacity setting to the configuration.
 *
 * @param opacity The opacity value to save between 0 and 100.
 */
export async function saveOpacityToConfig(opacity: number): Promise<void> {
    const config = vscode.workspace.getConfiguration('logsOpacity');
    await config.update('opacity', opacity, vscode.ConfigurationTarget.Global);
}
