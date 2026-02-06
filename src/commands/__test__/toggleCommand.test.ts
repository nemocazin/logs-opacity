import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { handleToggleCommand } from '../../commands/toggleCommand';
import { getToggleFromConfig, saveToggleToConfig } from '../../config/configManager';
import { recreateDecoration } from '../../core/decoration';

// Mock dependencies
vi.mock('../../config/configManager');
vi.mock('../../core/decoration');
vi.mock('vscode', () => ({
    window: {
        showInformationMessage: vi.fn(),
    },
}));

describe('toggleCommand', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('handleToggleCommand', () => {
        it('should enable the extension when it is disabled', async () => {
            vi.mocked(getToggleFromConfig).mockReturnValue(false);
            vi.mocked(saveToggleToConfig).mockResolvedValue(undefined);

            await handleToggleCommand();

            expect(getToggleFromConfig).toHaveBeenCalledTimes(1);
            expect(saveToggleToConfig).toHaveBeenCalledWith(true);
            expect(recreateDecoration).toHaveBeenCalledTimes(1);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Unobtrusive Logs is now enabled.');
        });

        it('should disable the extension when it is enabled', async () => {
            vi.mocked(getToggleFromConfig).mockReturnValue(true);
            vi.mocked(saveToggleToConfig).mockResolvedValue(undefined);

            await handleToggleCommand();

            expect(getToggleFromConfig).toHaveBeenCalledTimes(1);
            expect(saveToggleToConfig).toHaveBeenCalledWith(false);
            expect(recreateDecoration).toHaveBeenCalledTimes(1);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Unobtrusive Logs is now disabled.');
        });

        it('should call functions in the correct order', async () => {
            vi.mocked(getToggleFromConfig).mockReturnValue(false);
            vi.mocked(saveToggleToConfig).mockResolvedValue(undefined);

            const callOrder: string[] = [];

            vi.mocked(getToggleFromConfig).mockImplementation(() => {
                callOrder.push('getToggleFromConfig');
                return false;
            });

            vi.mocked(saveToggleToConfig).mockImplementation(() => {
                callOrder.push('saveToggleToConfig');
                return Promise.resolve();
            });

            vi.mocked(recreateDecoration).mockImplementation(() => {
                callOrder.push('recreateDecoration');
            });

            vi.mocked(vscode.window.showInformationMessage).mockImplementation(() => {
                callOrder.push('showInformationMessage');
                return Promise.resolve(undefined);
            });

            await handleToggleCommand();

            expect(callOrder).toEqual([
                'getToggleFromConfig',
                'saveToggleToConfig',
                'recreateDecoration',
                'showInformationMessage',
            ]);
        });

        it('should handle saveToggleToConfig rejecting', async () => {
            vi.mocked(getToggleFromConfig).mockReturnValue(false);
            const error = new Error('Save failed');
            vi.mocked(saveToggleToConfig).mockRejectedValue(error);

            await expect(handleToggleCommand()).rejects.toThrow('Save failed');
            expect(recreateDecoration).not.toHaveBeenCalled();
            expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
        });

        it('should toggle state correctly multiple times', async () => {
            vi.mocked(saveToggleToConfig).mockResolvedValue(undefined);

            vi.mocked(getToggleFromConfig).mockReturnValue(false);
            await handleToggleCommand();
            expect(saveToggleToConfig).toHaveBeenCalledWith(true);

            vi.clearAllMocks();

            vi.mocked(getToggleFromConfig).mockReturnValue(true);
            await handleToggleCommand();
            expect(saveToggleToConfig).toHaveBeenCalledWith(false);

            vi.clearAllMocks();

            vi.mocked(getToggleFromConfig).mockReturnValue(false);
            await handleToggleCommand();
            expect(saveToggleToConfig).toHaveBeenCalledWith(true);
        });
    });
});
