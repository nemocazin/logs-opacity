import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleDeleteCustomPatternCommand } from '../deletePatternCommands';
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

describe('deleteCustomPatternCommand', () => {
    let getToggleFromConfigMock: ReturnType<typeof vi.fn>;
    let getAllCustomPatternsMock: ReturnType<typeof vi.fn>;
    let deleteCustomPatternMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let showQuickPickMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        getToggleFromConfigMock = vi.mocked(configManager.getToggleFromConfig);
        getAllCustomPatternsMock = vi.mocked(configManager.getAllCustomPatterns);
        deleteCustomPatternMock = vi.mocked(configManager.deleteCustomPattern);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        showQuickPickMock = vi.mocked(vscode.window.showQuickPick);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        getToggleFromConfigMock.mockReturnValue(true);
        getAllCustomPatternsMock.mockReturnValue([
            { name: 'myPattern', pattern: 'console\\.log', language: 'javascript' },
            { name: 'goLog', pattern: 'fmt\\.Println', language: 'go' },
        ]);
        deleteCustomPatternMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('handleDeleteCustomPatternCommand', () => {
        it('should delete custom pattern when user selects one', async () => {
            showQuickPickMock.mockResolvedValue('myPattern');

            await handleDeleteCustomPatternCommand();

            expect(deleteCustomPatternMock).toHaveBeenCalledWith('myPattern');
        });

        it('should recreate decoration after deleting custom pattern', async () => {
            showQuickPickMock.mockResolvedValue('goLog');

            await handleDeleteCustomPatternCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with deleted pattern name', async () => {
            showQuickPickMock.mockResolvedValue('myPattern');

            await handleDeleteCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "myPattern" deleted.');
        });

        it('should return if extension is toggled off', async () => {
            getToggleFromConfigMock.mockReturnValue(false);

            await handleDeleteCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith(
                'Please toggle on the extension before deleting a custom pattern.',
            );
            expect(getAllCustomPatternsMock).not.toHaveBeenCalled();
            expect(deleteCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should show message when no custom patterns exist', async () => {
            getAllCustomPatternsMock.mockReturnValue([]);

            await handleDeleteCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('No custom patterns found to delete.');
            expect(showQuickPickMock).not.toHaveBeenCalled();
            expect(deleteCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
        });

        it('should not delete when user cancels selection', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomPatternCommand();

            expect(deleteCustomPatternMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalledWith(expect.stringContaining('deleted'));
        });

        it('should handle multiple custom patterns', async () => {
            getAllCustomPatternsMock.mockReturnValue([
                { name: 'pattern1', pattern: 'pattern1', language: 'javascript' },
                { name: 'pattern2', pattern: 'pattern2', language: 'typescript' },
                { name: 'pattern3', pattern: 'pattern3', language: 'go' },
            ]);
            showQuickPickMock.mockResolvedValue('pattern2');

            await handleDeleteCustomPatternCommand();

            expect(deleteCustomPatternMock).toHaveBeenCalledWith('pattern2');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "pattern2" deleted.');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            showQuickPickMock.mockResolvedValue('myPattern');
            deleteCustomPatternMock.mockImplementation(() => {
                callOrder.push('delete');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
            });

            await handleDeleteCustomPatternCommand();

            expect(callOrder).toEqual(['delete', 'recreate', 'confirm']);
        });
    });

    describe('promptForName', () => {
        it('should display quick pick with correct placeholder', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomPatternCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['myPattern', 'goLog'], {
                placeHolder: 'Select a custom pattern to delete.',
            });
        });

        it('should display all available custom pattern names', async () => {
            getAllCustomPatternsMock.mockReturnValue([
                { name: 'pattern1', pattern: 'pattern1', language: 'javascript' },
                { name: 'pattern2', pattern: 'pattern2', language: 'typescript' },
                { name: 'pattern3', pattern: 'pattern3', language: 'go' },
            ]);
            showQuickPickMock.mockResolvedValue(undefined);

            await handleDeleteCustomPatternCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['pattern1', 'pattern2', 'pattern3'], {
                placeHolder: 'Select a custom pattern to delete.',
            });
        });

        it('should handle single custom pattern', async () => {
            getAllCustomPatternsMock.mockReturnValue([
                { name: 'onlyPattern', pattern: 'pattern', language: 'javascript' },
            ]);
            showQuickPickMock.mockResolvedValue('onlyPattern');

            await handleDeleteCustomPatternCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(['onlyPattern'], {
                placeHolder: 'Select a custom pattern to delete.',
            });
            expect(deleteCustomPatternMock).toHaveBeenCalledWith('onlyPattern');
        });
    });

    describe('showDeletePatternConfirmation', () => {
        it('should show message with deleted pattern name', async () => {
            showQuickPickMock.mockResolvedValue('customPattern');

            await handleDeleteCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "customPattern" deleted.');
        });

        it('should show correct message for different pattern names', async () => {
            showQuickPickMock.mockResolvedValue('anotherPattern');

            await handleDeleteCustomPatternCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Custom pattern "anotherPattern" deleted.');
        });
    });
});
