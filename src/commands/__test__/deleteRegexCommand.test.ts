import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleDeleteCustomRegexCommand } from '../deleteRegexCommands';
import * as configManager from '../../config/configManager';
import * as decoration from '../../core/decoration';

// Mock vscode module
vi.mock('vscode', () => ({
    window: {
        showQuickPick: vi.fn(),
        showInformationMessage: vi.fn(),
    },
}));

// Mock dependencies
vi.mock('../../config/configManager');
vi.mock('../../core/decoration');

describe('deleteCustomRegexCommand', () => {
    let getToggleFromConfigMock: ReturnType<typeof vi.fn>;
    let getAllCustomRegexesMock: ReturnType<typeof vi.fn>;
    let deleteCustomRegexMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let showQuickPickMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        getToggleFromConfigMock = vi.mocked(configManager.getToggleFromConfig);
        getAllCustomRegexesMock = vi.mocked(configManager.getAllCustomRegexes);
        deleteCustomRegexMock = vi.mocked(configManager.deleteCustomRegex);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        showQuickPickMock = vi.mocked(vscode.window.showQuickPick);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        getToggleFromConfigMock.mockReturnValue(true);
        getAllCustomRegexesMock.mockReturnValue([
            { name: 'myRegex', pattern: 'console\\.log', language: 'javascript' },
            { name: 'goLog', pattern: 'fmt\\.Println', language: 'go' },
        ]);
        deleteCustomRegexMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('handleDeleteCustomRegexCommand', () => {
        it('should delete custom regex when user selects one', async () => {
            showQuickPickMock.mockResolvedValue('myRegex');

            await handleDeleteCustomRegexCommand();

            expect(deleteCustomRegexMock).toHaveBeenCalledWith('myRegex');
        });

        it('should recreate decoration after deleting custom regex', async () => {
            showQuickPickMock.mockResolvedValue('goLog');

            await handleDeleteCustomRegexCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with deleted regex name', async () => {
            showQuickPickMock.mockResolvedValue('myRegex');

            await handleDeleteCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "myRegex" deleted.');
        });

        it('should return if extension is toggled off', async () => {
            getToggleFromConfigMock.mockReturnValue(false);

            await handleDeleteCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith(
                'Please toggle on the extension before deleting a custom regex.',
            );
            expect(getAllCustomRegexesMock).not.toHaveBeenCalled();
            expect(deleteCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should show message when no custom regexes exist', async () => {
            getAllCustomRegexesMock.mockReturnValue([]);

            await handleDeleteCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('No custom regexes found to delete.');
            expect(showQuickPickMock).not.toHaveBeenCalled();
            expect(deleteCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should not delete when user cancels selection', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomRegexCommand();

            expect(deleteCustomRegexMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalledWith(expect.stringContaining('deleted'));
        });

        it('should handle multiple custom regexes', async () => {
            getAllCustomRegexesMock.mockReturnValue([
                { name: 'regex1', pattern: 'pattern1', language: 'javascript' },
                { name: 'regex2', pattern: 'pattern2', language: 'typescript' },
                { name: 'regex3', pattern: 'pattern3', language: 'go' },
            ]);
            showQuickPickMock.mockResolvedValue('regex2');

            await handleDeleteCustomRegexCommand();

            expect(deleteCustomRegexMock).toHaveBeenCalledWith('regex2');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "regex2" deleted.');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            showQuickPickMock.mockResolvedValue('myRegex');
            deleteCustomRegexMock.mockImplementation(() => {
                callOrder.push('delete');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
            });

            await handleDeleteCustomRegexCommand();

            expect(callOrder).toEqual(['delete', 'recreate', 'confirm']);
        });
    });

    describe('promptForName', () => {
        it('should display quick pick with correct placeholder', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomRegexCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['myRegex', 'goLog'], {
                placeHolder: 'Select a custom regex to delete.',
            });
        });

        it('should display all available custom regex names', async () => {
            getAllCustomRegexesMock.mockReturnValue([
                { name: 'regex1', pattern: 'pattern1', language: 'javascript' },
                { name: 'regex2', pattern: 'pattern2', language: 'typescript' },
                { name: 'regex3', pattern: 'pattern3', language: 'go' },
            ]);
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomRegexCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['regex1', 'regex2', 'regex3'], {
                placeHolder: 'Select a custom regex to delete.',
            });
        });

        it('should handle single custom regex', async () => {
            getAllCustomRegexesMock.mockReturnValue([
                { name: 'onlyRegex', pattern: 'pattern', language: 'javascript' },
            ]);
            showQuickPickMock.mockResolvedValue('onlyRegex');

            await handleDeleteCustomRegexCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['onlyRegex'], {
                placeHolder: 'Select a custom regex to delete.',
            });
            expect(deleteCustomRegexMock).toHaveBeenCalledWith('onlyRegex');
        });
    });

    describe('showDeleteRegexConfirmation', () => {
        it('should show message with deleted regex name', async () => {
            showQuickPickMock.mockResolvedValue('customRegex');

            await handleDeleteCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "customRegex" deleted.');
        });

        it('should show correct message for different regex names', async () => {
            showQuickPickMock.mockResolvedValue('anotherRegex');

            await handleDeleteCustomRegexCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom regex "anotherRegex" deleted.');
        });
    });
});
