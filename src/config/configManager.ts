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

/**
 * Retrieves the custom regexes from the configuration.
 *
 * @returns An array of custom regex objects, each containing language, name, and pattern properties.
 */
export function getAllCustomRegexes(): Array<{ language: string; name: string; pattern: string }> {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    return config.get('custom-regexes', []);
}

/**
 * Adds a new custom regex item to the configuration.
 *
 * @param language The programming language associated with the regex.
 * @param name The name of the regex item.
 * @param pattern The regex pattern to be added.
 */
export async function saveCustomRegex(language: string, name: string, pattern: string) {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    const items = getAllCustomRegexes();
    items.push({ language, name, pattern });
    await config.update('custom-regexes', items, vscode.ConfigurationTarget.Global);
}

/**
 * Removes a custom regex item from the configuration based on its name.
 *
 * @param name The name of the regex item to be removed.
 */
export async function deleteCustomRegex(name: string) {
    const config = vscode.workspace.getConfiguration('unobtrusive-logs');
    const items = getAllCustomRegexes();
    const index = items.findIndex(item => item.name === name);
    if (index !== -1) {
        items.splice(index, 1);
        await config.update('custom-regexes', items, vscode.ConfigurationTarget.Global);
    }
}
