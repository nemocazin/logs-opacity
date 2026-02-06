import * as vscode from 'vscode';

/**
 * Retrieves the toggle state from the configuration.
 *
 * @returns The toggle state (true for on, false for off).
 */
export function getToggleFromConfig(): boolean {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    return config.get<boolean>('toggle', false);
}

/**
 * Saves the toggle state to the configuration.
 *
 * @param toggle The toggle state to save (true for on, false for off).
 */
export async function saveToggleToConfig(toggle: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    await config.update('toggle', toggle, vscode.ConfigurationTarget.Global);
}

/**
 * Retrieves the color setting from the configuration.
 *
 * @returns The color value.
 */
export function getColorFromConfig(): string {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    return config.get<string>('color', '#808080');
}

/**
 * Safves the color setting to the configuration.
 *
 * @param color The color value to save.
 */
export async function saveColorToConfig(color: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    await config.update('color', color, vscode.ConfigurationTarget.Global);
}

/**
 * Retrieves the opacity setting from the configuration.
 *
 * @returns The opacity value between 0 and 100.
 */
export function getOpacityFromConfig(): number {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    return config.get<number>('opacity', 50);
}

/**
 * Saves the opacity setting to the configuration.
 *
 * @param opacity The opacity value to save between 0 and 100.
 */
export async function saveOpacityToConfig(opacity: number): Promise<void> {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    await config.update('opacity', opacity, vscode.ConfigurationTarget.Global);
}
