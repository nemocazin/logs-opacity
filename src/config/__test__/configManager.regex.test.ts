import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getAllCustomPatterns, saveCustomPattern, deleteCustomPattern } from '../configManager';

// Mock the vscode module
vi.mock('vscode', () => ({
    workspace: {
        getConfiguration: vi.fn(),
    },
    ConfigurationTarget: {
        Global: 1,
    },
}));

describe('Custom Patterns Configuration Tests', () => {
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

    describe('getAllCustomPatterns', () => {
        it('should return the configured custom patterns', () => {
            const mockPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            const result = getAllCustomPatterns();

            expect(result).toEqual(mockPatterns);
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('custom-patterns', []);
        });

        it('should return empty array when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            const result = getAllCustomPatterns();

            expect(result).toEqual([]);
        });

        it('should return single custom pattern', () => {
            const mockPattern = [{ language: 'typescript', name: 'debugger', pattern: 'debugger' }];
            vi.mocked(configMock.get).mockReturnValue(mockPattern);

            const result = getAllCustomPatterns();

            expect(result).toEqual(mockPattern);
            expect(result).toHaveLength(1);
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomPatterns();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomPatterns();

            expect(configMock.get).toHaveBeenCalledWith('custom-patterns', []);
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple patterns for different languages', () => {
            const mockPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
                { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            const result = getAllCustomPatterns();

            expect(result).toHaveLength(3);
            expect(result).toEqual(mockPatterns);
        });
    });

    describe('saveCustomPattern', () => {
        it('should add a new custom pattern to configuration', async () => {
            const existingPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(existingPatterns);

            await saveCustomPattern('python', 'print', 'print\\(');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'python', name: 'print', pattern: 'print\\(' },
                ],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should add first custom pattern to empty configuration', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomPattern('typescript', 'debugger', 'debugger');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [{ language: 'typescript', name: 'debugger', pattern: 'debugger' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should use Global configuration target', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomPattern('javascript', 'alert', 'alert\\(');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveCustomPattern('python', 'print', 'print\\(')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.get).mockReturnValue([]);
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveCustomPattern('python', 'print', 'print\\(')).rejects.toThrow(
                'Configuration update failed',
            );
        });

        it('should handle multiple consecutive saves', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }])
                .mockReturnValueOnce([
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'python', name: 'print', pattern: 'print\\(' },
                ]);

            await saveCustomPattern('javascript', 'console.log', 'console\\.log\\(');
            await saveCustomPattern('python', 'print', 'print\\(');
            await saveCustomPattern('java', 'System.out', 'System\\.out\\.println\\(');

            expect(configMock.update).toHaveBeenCalledTimes(3);
        });

        it('should preserve existing patterns when adding new one', async () => {
            const existingPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(existingPatterns);

            await saveCustomPattern('java', 'System.out', 'System\\.out\\.println\\(');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const savedPatterns = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(savedPatterns).toHaveLength(3);
            expect(savedPatterns?.[0]).toEqual(existingPatterns[0]);
            expect(savedPatterns?.[1]).toEqual(existingPatterns[1]);
        });

        it('should handle special characters in patterns', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomPattern('javascript', 'pattern-special', '\\[\\]\\(\\)\\{\\}\\*\\+\\?');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const savedPatterns = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(savedPatterns?.[0]?.pattern).toBe('\\[\\]\\(\\)\\{\\}\\*\\+\\?');
        });

        it('should handle empty strings in parameters', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomPattern('', '', '');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [{ language: '', name: '', pattern: '' }],
                vscode.ConfigurationTarget.Global,
            );
        });
    });

    describe('deleteCustomPattern', () => {
        it('should remove a custom pattern by name', async () => {
            const mockPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
                { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('print');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
                ],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should not update configuration if name does not exist', async () => {
            const mockPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('nonexistent');

            expect(configMock.update).not.toHaveBeenCalled();
        });

        it('should handle deletion from empty configuration', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await deleteCustomPattern('any-name');

            expect(configMock.update).not.toHaveBeenCalled();
        });

        it('should delete the first pattern when multiple exist', async () => {
            const mockPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('console.log');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [{ language: 'python', name: 'print', pattern: 'print\\(' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should delete the last pattern when multiple exist', async () => {
            const mockPatterns = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('print');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-patterns',
                [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should result in empty array when deleting the only pattern', async () => {
            const mockPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('console.log');

            expect(configMock.update).toHaveBeenCalledWith('custom-patterns', [], vscode.ConfigurationTarget.Global);
        });

        it('should use Global configuration target', async () => {
            const mockPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('console.log');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should only delete the first match when duplicate names exist', async () => {
            const mockPatterns = [
                { language: 'javascript', name: 'duplicate', pattern: 'pattern1' },
                { language: 'typescript', name: 'duplicate', pattern: 'pattern2' },
                { language: 'python', name: 'other', pattern: 'pattern3' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('duplicate');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const updatedPatterns = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(updatedPatterns).toHaveLength(2);
            expect(updatedPatterns?.[0]?.name).toBe('duplicate');
            expect(updatedPatterns?.[0]?.pattern).toBe('pattern2');
        });

        it('should resolve promise when update succeeds', async () => {
            const mockPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(deleteCustomPattern('console.log')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            const mockPatterns = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(deleteCustomPattern('console.log')).rejects.toThrow('Configuration update failed');
        });

        it('should handle case-sensitive name matching', async () => {
            const mockPatterns = [{ language: 'javascript', name: 'Console.Log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockPatterns);

            await deleteCustomPattern('console.log');

            expect(configMock.update).not.toHaveBeenCalled();
        });
    });

    describe('Integration between functions', () => {
        it('should be able to save and retrieve the same pattern', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'python', name: 'print', pattern: 'print\\(' }]);

            await saveCustomPattern('python', 'print', 'print\\(');
            const result = getAllCustomPatterns();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ language: 'python', name: 'print', pattern: 'print\\(' });
        });

        it('should be able to save and delete a pattern', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'python', name: 'print', pattern: 'print\\(' }]);

            await saveCustomPattern('python', 'print', 'print\\(');
            await deleteCustomPattern('print');

            expect(configMock.update).toHaveBeenCalledTimes(2);
            expect(configMock.update).toHaveBeenLastCalledWith(
                'custom-patterns',
                [],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should maintain configuration section consistency across all functions', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomPatterns();
            await saveCustomPattern('javascript', 'test', 'test');
            await deleteCustomPattern('test');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(5);
        });
    });
});
