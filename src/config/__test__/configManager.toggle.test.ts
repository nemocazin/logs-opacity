import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getToggleFromConfig, saveToggleToConfig } from '../configManager';

// Mock the vscode module
vi.mock('vscode', () => ({
    workspace: {
        getConfiguration: vi.fn(),
    },
    ConfigurationTarget: {
        Global: 1,
    },
}));

describe('Toggle Configuration Tests', () => {
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

    describe('getToggleFromConfig', () => {
        it('should return the configured toggle value', () => {
            vi.mocked(configMock.get).mockReturnValue(true);

            const result = getToggleFromConfig();

            expect(result).toBe(true);
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('toggle', false);
        });

        it('should return default value of false when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue(false);

            const result = getToggleFromConfig();

            expect(result).toBe(false);
        });

        it('should handle true toggle value', () => {
            vi.mocked(configMock.get).mockReturnValue(true);

            const result = getToggleFromConfig();

            expect(result).toBe(true);
        });

        it('should handle false toggle value', () => {
            vi.mocked(configMock.get).mockReturnValue(false);

            const result = getToggleFromConfig();

            expect(result).toBe(false);
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue(false);

            getToggleFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue(false);

            getToggleFromConfig();

            expect(configMock.get).toHaveBeenCalledWith('toggle', false);
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveToggleToConfig', () => {
        it('should save toggle value to global configuration', async () => {
            await saveToggleToConfig(true);

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith('toggle', true, vscode.ConfigurationTarget.Global);
        });

        it('should save true toggle value', async () => {
            await saveToggleToConfig(true);

            expect(configMock.update).toHaveBeenCalledWith('toggle', true, vscode.ConfigurationTarget.Global);
        });

        it('should save false toggle value', async () => {
            await saveToggleToConfig(false);

            expect(configMock.update).toHaveBeenCalledWith('toggle', false, vscode.ConfigurationTarget.Global);
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveToggleToConfig(true)).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveToggleToConfig(true)).rejects.toThrow('Configuration update failed');
        });

        it('should use Global configuration target', async () => {
            await saveToggleToConfig(true);

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Boolean),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should handle multiple consecutive saves', async () => {
            await saveToggleToConfig(true);
            await saveToggleToConfig(false);
            await saveToggleToConfig(true);

            expect(configMock.update).toHaveBeenCalledTimes(3);
            expect(configMock.update).toHaveBeenNthCalledWith(1, 'toggle', true, vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(2, 'toggle', false, vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(3, 'toggle', true, vscode.ConfigurationTarget.Global);
        });

        it('should call update only once per save', async () => {
            await saveToggleToConfig(true);

            expect(configMock.update).toHaveBeenCalledTimes(1);
        });

        it('should be able to save and retrieve the same value', async () => {
            const testToggle = true;

            await saveToggleToConfig(testToggle);
            vi.mocked(configMock.get).mockReturnValue(testToggle);

            const result = getToggleFromConfig();

            expect(result).toBe(testToggle);
        });

        it('should maintain configuration section consistency', async () => {
            await saveToggleToConfig(true);
            getToggleFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2);
        });
    });
});
