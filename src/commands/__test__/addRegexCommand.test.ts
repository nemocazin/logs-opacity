import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleAddCustomRegexCommand } from '../addRegexCommand';
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

describe('addCustomRegexCommand', () => {
    let getToggleFromConfigMock: ReturnType<typeof vi.fn>;
    let saveCustomRegexMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let showQuickPickMock: ReturnType<typeof vi.fn>;
    let showInputBoxMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        getToggleFromConfigMock = vi.mocked(configManager.getToggleFromConfig);
        saveCustomRegexMock = vi.mocked(configManager.saveCustomRegex);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        showQuickPickMock = vi.mocked(vscode.window.showQuickPick);
        showInputBoxMock = vi.mocked(vscode.window.showInputBox);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        getToggleFromConfigMock.mockReturnValue(true);
        saveCustomRegexMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('handleAddCustomRegexCommand', () => {
        it('should save custom regex when user provides all inputs', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myRegex');
            showInputBoxMock.mockResolvedValueOnce('console\\.log');

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).toHaveBeenCalledWith('javascript', 'myRegex', 'console\\.log');
        });

        it('should recreate decoration after saving custom regex', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'Go',
                languageId: 'go',
            });
            showInputBoxMock.mockResolvedValueOnce('goLog');
            showInputBoxMock.mockResolvedValueOnce('fmt\\.Println');

            await handleAddCustomRegexCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with regex name and language', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'TypeScript',
                languageId: 'typescript',
            });
            showInputBoxMock.mockResolvedValueOnce('tsLog');
            showInputBoxMock.mockResolvedValueOnce('console\\.debug');

            await handleAddCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "tsLog" added for typescript.');
        });

        it('should return if extension is toggled off', async () => {
            getToggleFromConfigMock.mockReturnValue(false);

            await handleAddCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith(
                'Please toggle on the extension before adding a custom regex.',
            );
            expect(saveCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should not save when user cancels language selection', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalledWith(expect.stringContaining('Custom regex'));
        });

        it('should not save when user cancels name input', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should not save when user cancels regex pattern input', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myRegex');
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should handle General language selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'General',
                languageId: 'general',
            });
            showInputBoxMock.mockResolvedValueOnce('generalLog');
            showInputBoxMock.mockResolvedValueOnce('log');

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).toHaveBeenCalledWith('general', 'generalLog', 'log');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "generalLog" added for general.');
        });

        it('should handle C++ language selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'C++',
                languageId: 'cpp',
            });
            showInputBoxMock.mockResolvedValueOnce('cppLog');
            showInputBoxMock.mockResolvedValueOnce('std::cout');

            await handleAddCustomRegexCommand();

            expect(saveCustomRegexMock).toHaveBeenCalledWith('cpp', 'cppLog', 'std::cout');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "cppLog" added for cpp.');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myRegex');
            showInputBoxMock.mockResolvedValueOnce('console\\.log');
            saveCustomRegexMock.mockImplementation(() => {
                callOrder.push('save');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
            });

            await handleAddCustomRegexCommand();

            expect(callOrder).toEqual(['save', 'recreate', 'confirm']);
        });
    });

    describe('promptForLanguage', () => {
        it('should display language picker with correct placeholder', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomRegexCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ label: 'General', languageId: 'general' }),
                    expect.objectContaining({ label: 'JavaScript', languageId: 'javascript' }),
                ]),
                {
                    placeHolder: 'Select a language for your custom regex.',
                    matchOnDescription: true,
                },
            );
        });

        it('should include all 5 language options', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomRegexCommand();

            const calls = showQuickPickMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const languageOptions = calls[0]?.[0] as unknown[];

            expect(languageOptions).toHaveLength(5);
        });

        it('should have matchOnDescription set to true', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleAddCustomRegexCommand();

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

            await handleAddCustomRegexCommand();

            expect(showInputBoxMock).toHaveBeenCalledWith({
                prompt: 'Enter a name for your custom regex.',
            });
        });
    });

    describe('promptForRegex', () => {
        it('should show input box with correct prompt for regex pattern', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'JavaScript',
                languageId: 'javascript',
            });
            showInputBoxMock.mockResolvedValueOnce('myRegex');
            showInputBoxMock.mockResolvedValueOnce(undefined);

            await handleAddCustomRegexCommand();

            const calls = showInputBoxMock.mock.calls;
            expect(calls[1]?.[0]).toEqual({
                prompt: 'Enter regex pattern to match log statements.',
            });
        });
    });

    describe('showAddRegexConfirmation', () => {
        it('should show message with language and name', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'TypeScript',
                languageId: 'typescript',
            });
            showInputBoxMock.mockResolvedValueOnce('myCustomRegex');
            showInputBoxMock.mockResolvedValueOnce('console\\.info');

            await handleAddCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith(
                'Custom regex "myCustomRegex" added for typescript.',
            );
        });
    });
});
