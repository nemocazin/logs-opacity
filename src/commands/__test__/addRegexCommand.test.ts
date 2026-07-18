import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleAddCustomPatternCommand } from '../addPatternCommand';
import * as configManager from '../../config/configManager';
import * as decoration from '../../core/decoration';

// Mock vscode module
vi.mock('vscode', () => ({
    window: {
        showQuickPick: vi.fn(),
        showInputBox: vi.fn(),
        showInformationMessage: vi.fn(),
    },
}));

// Mock dependencies
vi.mock('../../config/configManager');
vi.mock('../../core/decoration');

describe('addCustomPatternCommand', () => {
    let saveCustomPatternMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let showQuickPickMock: ReturnType<typeof vi.fn>;
    let showInputBoxMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        saveCustomPatternMock = vi.mocked(configManager.saveCustomPattern);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        showQuickPickMock = vi.mocked(vscode.window.showQuickPick);
        showInputBoxMock = vi.mocked(vscode.window.showInputBox);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        saveCustomPatternMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('handleAddCustomPatternCommand', () => {
        it('should save custom pattern when user provides all inputs', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myPattern');
            showInputBoxMock.mockResolvedValueOnce('console\\.log');

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).toHaveBeenCalledWith('javascript', 'myPattern', 'console\\.log');
        });

        it('should recreate decoration after saving custom pattern', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'Go',
                languageId: 'go',
            });
            showInputBoxMock.mockResolvedValueOnce('goLog');
            showInputBoxMock.mockResolvedValueOnce('fmt\\.Println');

            await handleAddCustomPatternCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with pattern name and language', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'TypeScript',
                languageId: 'typescript',
            });
            showInputBoxMock.mockResolvedValueOnce('tsLog');
            showInputBoxMock.mockResolvedValueOnce('console\\.debug');

            await handleAddCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "tsLog" added for typescript.');
        });

        it('should not save when user cancels language selection', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalledWith(expect.stringContaining('Custom pattern'));
        });

        it('should not save when user cancels name input', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should not save when user cancels pattern pattern input', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myPattern');
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should handle General language selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'General',
                languageId: 'general',
            });
            showInputBoxMock.mockResolvedValueOnce('generalLog');
            showInputBoxMock.mockResolvedValueOnce('log');

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).toHaveBeenCalledWith('general', 'generalLog', 'log');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "generalLog" added for general.');
        });

        it('should handle C++ language selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'C++',
                languageId: 'cpp',
            });
            showInputBoxMock.mockResolvedValueOnce('cppLog');
            showInputBoxMock.mockResolvedValueOnce('std::cout');

            await handleAddCustomPatternCommand();

            expect(saveCustomPatternMock).toHaveBeenCalledWith('cpp', 'cppLog', 'std::cout');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "cppLog" added for cpp.');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myPattern');
            showInputBoxMock.mockResolvedValueOnce('console\\.log');
            saveCustomPatternMock.mockImplementation(() => {
                callOrder.push('save');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
            });

            await handleAddCustomPatternCommand();

            expect(callOrder).toEqual(['save', 'recreate', 'confirm']);
        });
    });

    describe('promptForLanguage', () => {
        it('should display language picker with correct placeholder', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomPatternCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ label: 'General', languageId: 'general' }),
                    expect.objectContaining({ label: 'JavaScript', languageId: 'javascript' }),
                ]),
                {
                    placeHolder: 'Select a language for your custom pattern.',
                    matchOnDescription: true,
                },
            );
        });

        it('should include all 5 language options', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomPatternCommand();

            const calls = showQuickPickMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const languageOptions = calls[0]?.[0] as unknown[];

            expect(languageOptions).toHaveLength(5);
        });

        it('should have matchOnDescription set to true', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomPatternCommand();

            const calls = showQuickPickMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const options = calls[0]?.[1] as { matchOnDescription?: boolean } | undefined;

            expect(options?.matchOnDescription).toBe(true);
        });
    });

    describe('promptForName', () => {
        it('should show input box with correct prompt for name', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomPatternCommand();

            expect(showInputBoxMock).toHaveBeenCalledWith({
                prompt: 'Enter a name for your custom pattern.',
            });
        });
    });

    describe('promptForPattern', () => {
        it('should show input box with correct prompt for pattern', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myPattern');
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomPatternCommand();

            const calls = showInputBoxMock.mock.calls;
            expect(calls[1]?.[0]).toEqual({
                prompt: 'Enter a pattern to match log statements.',
            });
        });
    });

    describe('showAddPatternConfirmation', () => {
        it('should show message with language and name', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'TypeScript',
                languageId: 'typescript',
            });
            showInputBoxMock.mockResolvedValueOnce('myCustomPattern');
            showInputBoxMock.mockResolvedValueOnce('console\\.info');

            await handleAddCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith(
                'Custom pattern "myCustomPattern" added for typescript.',
            );
        });
    });
});
