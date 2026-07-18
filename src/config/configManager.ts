import * as vscode from 'vscode';

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

/**
 * Retrieves the custom patterns from the configuration.
 *
 * @returns An array of custom pattern objects, each containing language, name, and pattern properties.
 */
export function getAllCustomPatterns(): Array<{ language: string; name: string; pattern: string }> {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    return config.get('custom-patterns', []);
}

/**
 * Adds a new custom pattern item to the configuration.
 *
 * @param language The programming language associated with the pattern.
 * @param name The name of the pattern item.
 * @param pattern The pattern to be added.
 */
export async function saveCustomPattern(language: string, name: string, pattern: string) {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    const items = getAllCustomPatterns();
    items.push({ language, name, pattern });
    await config.update('custom-patterns', items, vscode.ConfigurationTarget.Global);
}

/**
 * Removes a custom pattern item from the configuration based on its name.
 *
 * @param name The name of the pattern item to be removed.
 */
export async function deleteCustomPattern(name: string) {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    const items = getAllCustomPatterns();
    const index = items.findIndex(item => item.name === name);
    if (index !== -1) {
        items.splice(index, 1);
        await config.update('custom-patterns', items, vscode.ConfigurationTarget.Global);
    }
}
