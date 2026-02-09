import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getAllCustomRegexes, saveCustomRegex, deleteCustomRegex } from '../configManager';

// Mock the vscode module
vi.mock('vscode', () => ({
    workspace: {
        getConfiguration: vi.fn(),
    },
    ConfigurationTarget: {
        Global: 1,
    },
}));

describe('Custom Regexes Configuration Tests', () => {
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

    describe('getAllCustomRegexes', () => {
        it('should return the configured custom regexes', () => {
            const mockRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            const result = getAllCustomRegexes();

            expect(result).toEqual(mockRegexes);
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('custom-regexes', []);
        });

        it('should return empty array when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            const result = getAllCustomRegexes();

            expect(result).toEqual([]);
        });

        it('should return single custom regex', () => {
            const mockRegex = [{ language: 'typescript', name: 'debugger', pattern: 'debugger' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegex);

            const result = getAllCustomRegexes();

            expect(result).toEqual(mockRegex);
            expect(result).toHaveLength(1);
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomRegexes();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomRegexes();

            expect(configMock.get).toHaveBeenCalledWith('custom-regexes', []);
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple regexes for different languages', () => {
            const mockRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
                { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            const result = getAllCustomRegexes();

            expect(result).toHaveLength(3);
            expect(result).toEqual(mockRegexes);
        });
    });

    describe('saveCustomRegex', () => {
        it('should add a new custom regex to configuration', async () => {
            const existingRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(existingRegexes);

            await saveCustomRegex('python', 'print', 'print\\(');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'python', name: 'print', pattern: 'print\\(' },
                ],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should add first custom regex to empty configuration', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomRegex('typescript', 'debugger', 'debugger');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [{ language: 'typescript', name: 'debugger', pattern: 'debugger' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should use Global configuration target', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomRegex('javascript', 'alert', 'alert\\(');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveCustomRegex('python', 'print', 'print\\(')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.get).mockReturnValue([]);
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveCustomRegex('python', 'print', 'print\\(')).rejects.toThrow('Configuration update failed');
        });

        it('should handle multiple consecutive saves', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }])
                .mockReturnValueOnce([
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'python', name: 'print', pattern: 'print\\(' },
                ]);

            await saveCustomRegex('javascript', 'console.log', 'console\\.log\\(');
            await saveCustomRegex('python', 'print', 'print\\(');
            await saveCustomRegex('java', 'System.out', 'System\\.out\\.println\\(');

            expect(configMock.update).toHaveBeenCalledTimes(3);
        });

        it('should preserve existing regexes when adding new one', async () => {
            const existingRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(existingRegexes);

            await saveCustomRegex('java', 'System.out', 'System\\.out\\.println\\(');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const savedRegexes = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(savedRegexes).toHaveLength(3);
            expect(savedRegexes?.[0]).toEqual(existingRegexes[0]);
            expect(savedRegexes?.[1]).toEqual(existingRegexes[1]);
        });

        it('should handle special characters in patterns', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomRegex('javascript', 'regex-special', '\\[\\]\\(\\)\\{\\}\\*\\+\\?');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const savedRegexes = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(savedRegexes?.[0]?.pattern).toBe('\\[\\]\\(\\)\\{\\}\\*\\+\\?');
        });

        it('should handle empty strings in parameters', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await saveCustomRegex('', '', '');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [{ language: '', name: '', pattern: '' }],
                vscode.ConfigurationTarget.Global,
            );
        });
    });

    describe('deleteCustomRegex', () => {
        it('should remove a custom regex by name', async () => {
            const mockRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
                { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('print');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [
                    { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                    { language: 'java', name: 'System.out', pattern: 'System\\.out\\.println\\(' },
                ],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should not update configuration if name does not exist', async () => {
            const mockRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('nonexistent');

            expect(configMock.update).not.toHaveBeenCalled();
        });

        it('should handle deletion from empty configuration', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            await deleteCustomRegex('any-name');

            expect(configMock.update).not.toHaveBeenCalled();
        });

        it('should delete the first regex when multiple exist', async () => {
            const mockRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('console.log');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [{ language: 'python', name: 'print', pattern: 'print\\(' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should delete the last regex when multiple exist', async () => {
            const mockRegexes = [
                { language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' },
                { language: 'python', name: 'print', pattern: 'print\\(' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('print');

            expect(configMock.update).toHaveBeenCalledWith(
                'custom-regexes',
                [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }],
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should result in empty array when deleting the only regex', async () => {
            const mockRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('console.log');

            expect(configMock.update).toHaveBeenCalledWith('custom-regexes', [], vscode.ConfigurationTarget.Global);
        });

        it('should use Global configuration target', async () => {
            const mockRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('console.log');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should only delete the first match when duplicate names exist', async () => {
            const mockRegexes = [
                { language: 'javascript', name: 'duplicate', pattern: 'pattern1' },
                { language: 'typescript', name: 'duplicate', pattern: 'pattern2' },
                { language: 'python', name: 'other', pattern: 'pattern3' },
            ];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('duplicate');

            const updateCall = configMock.update.mock.calls[0];
            expect(updateCall).toBeDefined();
            const updatedRegexes = updateCall?.[1] as Array<{ language: string; name: string; pattern: string }>;
            expect(updatedRegexes).toHaveLength(2);
            expect(updatedRegexes?.[0]?.name).toBe('duplicate');
            expect(updatedRegexes?.[0]?.pattern).toBe('pattern2');
        });

        it('should resolve promise when update succeeds', async () => {
            const mockRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(deleteCustomRegex('console.log')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            const mockRegexes = [{ language: 'javascript', name: 'console.log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(deleteCustomRegex('console.log')).rejects.toThrow('Configuration update failed');
        });

        it('should handle case-sensitive name matching', async () => {
            const mockRegexes = [{ language: 'javascript', name: 'Console.Log', pattern: 'console\\.log\\(' }];
            vi.mocked(configMock.get).mockReturnValue(mockRegexes);

            await deleteCustomRegex('console.log');

            expect(configMock.update).not.toHaveBeenCalled();
        });
    });

    describe('Integration between functions', () => {
        it('should be able to save and retrieve the same regex', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'python', name: 'print', pattern: 'print\\(' }]);

            await saveCustomRegex('python', 'print', 'print\\(');
            const result = getAllCustomRegexes();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ language: 'python', name: 'print', pattern: 'print\\(' });
        });

        it('should be able to save and delete a regex', async () => {
            vi.mocked(configMock.get)
                .mockReturnValueOnce([])
                .mockReturnValueOnce([{ language: 'python', name: 'print', pattern: 'print\\(' }]);

            await saveCustomRegex('python', 'print', 'print\\(');
            await deleteCustomRegex('print');

            expect(configMock.update).toHaveBeenCalledTimes(2);
            expect(configMock.update).toHaveBeenLastCalledWith('custom-regexes', [], vscode.ConfigurationTarget.Global);
        });

        it('should maintain configuration section consistency across all functions', async () => {
            vi.mocked(configMock.get).mockReturnValue([]);

            getAllCustomRegexes();
            await saveCustomRegex('javascript', 'test', 'test');
            await deleteCustomRegex('test');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(5);
        });
    });
});
