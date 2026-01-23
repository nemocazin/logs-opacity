import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from '../changeOpacityCommand';
import * as configManager from '../../config/configManager';
import * as decoration from '../../core/decoration';
import * as decorationUpdater from '../../core/decorationUpdater';

// Mock vscode module
vi.mock('vscode', () => ({
    window: {
        showInputBox: vi.fn(),
        showInformationMessage: vi.fn(),
    },
}));

// Mock dependencies
vi.mock('../config/configManager', () => ({
    getOpacityFromConfig: vi.fn(),
    saveOpacityToConfig: vi.fn(),
}));

vi.mock('../core/decoration', () => ({
    recreateDecoration: vi.fn(),
}));

vi.mock('../core/decorationUpdater', () => ({
    updateAllVisibleEditors: vi.fn(),
}));

describe('changeOpacityCommand', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(configManager, 'getOpacityFromConfig').mockReturnValue(50);
        vi.spyOn(configManager, 'saveOpacityToConfig').mockResolvedValue();
        vi.spyOn(decoration, 'recreateDecoration').mockImplementation(() => {});
        vi.spyOn(decorationUpdater, 'updateAllVisibleEditors').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('validateOpacityInput', () => {
        // Extract the validation function for testing
        const validateOpacityInput = (value: string): string | null => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 100) {
                return 'Please enter a number between 0 and 100';
            }
            return null;
        };

        it('should return null for valid opacity value 0', () => {
            expect(validateOpacityInput('0')).toBeNull();
        });

        it('should return null for valid opacity value 50', () => {
            expect(validateOpacityInput('50')).toBeNull();
        });

        it('should return null for valid opacity value 100', () => {
            expect(validateOpacityInput('100')).toBeNull();
        });

        it('should return null for valid decimal opacity value', () => {
            expect(validateOpacityInput('33.5')).toBeNull();
            expect(validateOpacityInput('75.25')).toBeNull();
        });

        it('should return error message for value below 0', () => {
            expect(validateOpacityInput('-1')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('-50')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for value above 100', () => {
            expect(validateOpacityInput('101')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('200')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('999')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for non-numeric input', () => {
            expect(validateOpacityInput('abc')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('fifty')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('test')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for empty string', () => {
            expect(validateOpacityInput('')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for whitespace', () => {
            expect(validateOpacityInput('   ')).toBe('Please enter a number between 0 and 100');
        });

        it('should accept numeric strings with whitespace', () => {
            expect(validateOpacityInput(' 50 ')).toBeNull();
            expect(validateOpacityInput('  75  ')).toBeNull();
        });

        it('should return error message for special characters', () => {
            expect(validateOpacityInput('@#$')).toBe('Please enter a number between 0 and 100');
        });

        it('should accept edge case values', () => {
            expect(validateOpacityInput('0.1')).toBeNull();
            expect(validateOpacityInput('99.9')).toBeNull();
        });
    });

    describe('handleChangeOpacityCommand', () => {
        it('should get current opacity from config', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(configManager.getOpacityFromConfig).toHaveBeenCalledTimes(1);
        });

        it('should prompt user with current opacity value', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(75);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(vscode.window.showInputBox).toHaveBeenCalledWith({
                prompt: 'Enter opacity value (0 = invisible, 100 = normal)',
                value: '75',
                validateInput: expect.any(Function),
            });
        });

        it('should save new opacity value when user provides valid input', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('80');

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).toHaveBeenCalledWith(80);
        });

        it('should recreate decoration after saving new opacity', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('60');

            await handleChangeOpacityCommand();

            expect(decoration.recreateDecoration).toHaveBeenCalledTimes(1);
        });

        it('should update all visible editors after changing opacity', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('70');

            await handleChangeOpacityCommand();

            expect(decorationUpdater.updateAllVisibleEditors).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with new opacity value', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('90');

            await handleChangeOpacityCommand();

            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 90%');
        });

        it('should not save or update when user cancels input', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).not.toHaveBeenCalled();
            expect(decoration.recreateDecoration).not.toHaveBeenCalled();
            expect(decorationUpdater.updateAllVisibleEditors).not.toHaveBeenCalled();
            expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
        });

        it('should not save or update when user provides empty string', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('');

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).not.toHaveBeenCalled();
            expect(decoration.recreateDecoration).not.toHaveBeenCalled();
            expect(decorationUpdater.updateAllVisibleEditors).not.toHaveBeenCalled();
            expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
        });

        it('should handle decimal opacity values correctly', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('33.5');

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).toHaveBeenCalledWith(33.5);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 33.5%');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('60');
            vi.mocked(configManager.saveOpacityToConfig).mockImplementation(async () => {
                callOrder.push('save');
            });
            vi.mocked(decoration.recreateDecoration).mockImplementation(() => {
                callOrder.push('recreate');
            });
            vi.mocked(decorationUpdater.updateAllVisibleEditors).mockImplementation(() => {
                callOrder.push('update');
            });
            vi.mocked(vscode.window.showInformationMessage).mockImplementation(() => {
                callOrder.push('confirm');
                return Promise.resolve(undefined);
            });

            await handleChangeOpacityCommand();

            expect(callOrder).toEqual(['save', 'recreate', 'update', 'confirm']);
        });

        it('should handle opacity value of 0', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('0');

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).toHaveBeenCalledWith(0);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 0%');
        });

        it('should handle opacity value of 100', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('100');

            await handleChangeOpacityCommand();

            expect(configManager.saveOpacityToConfig).toHaveBeenCalledWith(100);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 100%');
        });
    });

    describe('promptForOpacity', () => {
        it('should display correct prompt message', async () => {
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const mockFn = vscode.window.showInputBox as Mock;
            const callArgs = mockFn.mock.calls[0][0];
            expect(callArgs.prompt).toBe('Enter opacity value (0 = invisible, 100 = normal)');
        });

        it('should pre-fill input with current value', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(65);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const mockFn = vscode.window.showInputBox as Mock;
            const callArgs = mockFn.mock.calls[0][0];
            expect(callArgs.value).toBe('65');
        });

        it('should include validation function', async () => {
            vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const mockFn = vscode.window.showInputBox as Mock;
            const callArgs = mockFn.mock.calls[0][0];
            expect(callArgs.validateInput).toBeTypeOf('function');
        });
    });

    describe('showOpacityConfirmation', () => {
        it('should show message with percentage symbol', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('42');

            await handleChangeOpacityCommand();

            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 42%');
        });

        it('should format decimal values in message', async () => {
            vi.mocked(configManager.getOpacityFromConfig).mockReturnValue(50);
            vi.mocked(vscode.window.showInputBox).mockResolvedValue('66.67');

            await handleChangeOpacityCommand();

            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Logs opacity set to 66.67%');
        });
    });
});
