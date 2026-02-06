import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getColorFromConfig, saveColorToConfig } from '../configManager';

// Mock the vscode module
vi.mock('vscode', () => ({
    workspace: {
        getConfiguration: vi.fn(),
    },
    ConfigurationTarget: {
        Global: 1,
    },
}));

describe('Color Configuration Tests', () => {
    let configMock: {
        get: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        has: ReturnType<typeof vi.fn>;
        inspect: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        configMock = {
            get: vi.fn(),
            update: vi.fn().mockResolvedValue(undefined),
            has: vi.fn(),
            inspect: vi.fn(),
        };

        vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(configMock as vscode.WorkspaceConfiguration);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getColorFromConfig', () => {
        it('should return the configured color value', () => {
            vi.mocked(configMock.get).mockReturnValue('#FF5733');

            const result = getColorFromConfig();

            expect(result).toBe('#FF5733');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('color', '#808080');
        });

        it('should return default value of #808080 when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            const result = getColorFromConfig();

            expect(result).toBe('#808080');
        });

        it('should handle various hex color formats', () => {
            const colors = ['#000000', '#FFFFFF', '#123ABC', '#fff'];

            colors.forEach(color => {
                vi.mocked(configMock.get).mockReturnValue(color);
                const result = getColorFromConfig();
                expect(result).toBe(color);
            });
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            getColorFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            getColorFromConfig();

            expect(configMock.get).toHaveBeenCalledWith('color', '#808080');
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveColorToConfig', () => {
        it('should save color value to global configuration', async () => {
            await saveColorToConfig('#FF5733');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith('color', '#FF5733', vscode.ConfigurationTarget.Global);
        });

        it('should save various hex color values', async () => {
            const testColors = ['#000000', '#FFFFFF', '#808080', '#FF5733'];

            for (const color of testColors) {
                await saveColorToConfig(color);
                expect(configMock.update).toHaveBeenCalledWith('color', color, vscode.ConfigurationTarget.Global);
            }
        });

        it('should save shorthand hex colors', async () => {
            await saveColorToConfig('#fff');

            expect(configMock.update).toHaveBeenCalledWith('color', '#fff', vscode.ConfigurationTarget.Global);
        });

        it('should save lowercase hex colors', async () => {
            await saveColorToConfig('#abc123');

            expect(configMock.update).toHaveBeenCalledWith('color', '#abc123', vscode.ConfigurationTarget.Global);
        });

        it('should save uppercase hex colors', async () => {
            await saveColorToConfig('#ABC123');

            expect(configMock.update).toHaveBeenCalledWith('color', '#ABC123', vscode.ConfigurationTarget.Global);
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveColorToConfig('#808080')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveColorToConfig('#808080')).rejects.toThrow('Configuration update failed');
        });

        it('should use Global configuration target', async () => {
            await saveColorToConfig('#808080');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should handle multiple consecutive saves', async () => {
            await saveColorToConfig('#FF0000');
            await saveColorToConfig('#00FF00');
            await saveColorToConfig('#0000FF');

            expect(configMock.update).toHaveBeenCalledTimes(3);
            expect(configMock.update).toHaveBeenNthCalledWith(1, 'color', '#FF0000', vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(2, 'color', '#00FF00', vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(3, 'color', '#0000FF', vscode.ConfigurationTarget.Global);
        });

        it('should call update only once per save', async () => {
            await saveColorToConfig('#808080');

            expect(configMock.update).toHaveBeenCalledTimes(1);
        });

        it('should be able to save and retrieve the same value', async () => {
            const testColor = '#FF5733';

            await saveColorToConfig(testColor);
            vi.mocked(configMock.get).mockReturnValue(testColor);

            const result = getColorFromConfig();

            expect(result).toBe(testColor);
        });

        it('should maintain configuration section consistency', async () => {
            await saveColorToConfig('#808080');
            getColorFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2);
        });
    });
});
