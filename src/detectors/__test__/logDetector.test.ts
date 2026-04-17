import { describe, it, expect, vi } from 'vitest';
import { findLogStatements, findMatchesWithPattern, getLogPatterns } from '../logDetector';
import type * as vscode from 'vscode';
import { getAllCustomPatterns } from '../../config/configManager';

// Mock vscode module
vi.mock('vscode', () => ({
    Range: class {
        start: Position;
        end: Position;
        constructor(start: Position, end: Position) {
            this.start = start;
            this.end = end;
        }
    },
    workspace: {
        getConfiguration: vi.fn(() => ({
            get: vi.fn(<T>(key: string, defaultValue: T) => defaultValue),
        })),
    },
}));

// Mock configManager module
vi.mock('../../config/configManager', () => ({
    getAllCustomPatterns: vi.fn(() => []),
}));

type Position = {
    line: number;
    character: number;
};

type MockDocument = {
    getText: () => string;
    languageId: string;
    positionAt: (offset: number) => Position;
};

type MockEditor = {
    document: MockDocument;
};

/**
 * Creates a mock TextEditor with the given text and language ID.
 *
 * @param text text content of the document
 * @param languageId language identifier
 * @returns mock TextEditor instance
 */
function createMockEditor(text: string, languageId: string): vscode.TextEditor {
    const lines = text.split('\n');

    const mockEditor: MockEditor = {
        document: {
            getText: () => text,
            languageId,
            positionAt: (offset: number): Position => {
                let currentOffset = 0;
                for (let line = 0; line < lines.length; line++) {
                    const currentLine = lines[line];
                    if (currentLine === undefined) {
                        return { line: 0, character: 0 };
                    }
                    const lineLength = currentLine.length + 1; // +1 for newline
                    if (currentOffset + lineLength > offset || line === lines.length - 1) {
                        return {
                            line,
                            character: offset - currentOffset,
                        };
                    }
                    currentOffset += lineLength;
                }
                return { line: 0, character: 0 };
            },
        },
    };

    return mockEditor as vscode.TextEditor;
}

describe('logDetector', () => {
    describe('findLogStatements', () => {
        it('should match general log patterns (e.g., log.*)', () => {
            const text = 'log.info("general log");\nlog.debug("debug log");';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThanOrEqual(2);
        });

        it('should find console.log in TypeScript', () => {
            const text = 'const x = 5;\nconsole.log(x);\nconst y = 10;';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
            expect(results[0]?.range).toBeDefined();
        });

        it('should find multiple log statements in JavaScript', () => {
            const text = 'console.log("a");\nconsole.error("b");\nconsole.log("c");';
            const editor = createMockEditor(text, 'javascript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThanOrEqual(2);
        });

        it('should handle TypeScript React files', () => {
            const text = 'console.log("test");';
            const editor = createMockEditor(text, 'typescriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle JavaScript React files', () => {
            const text = 'console.log("test");';
            const editor = createMockEditor(text, 'javascriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle logs with spaces before opening parenthesis', () => {
            const text = 'console.log      ("test");';
            const editor = createMockEditor(text, 'javascriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle logs with multiples functions calls inside it', () => {
            const text = 'console.log(JSON.stringify({name: "John"}));';
            const editor = createMockEditor(text, 'javascriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should return empty array when no logs found', () => {
            const text = 'const x = 5;\nconst y = 10;';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should return empty array when logs found but no opening parenthesis', () => {
            const text = 'const x = 5;\nconsole.log{x);';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should return empty array when logs found but no closing parenthesis', () => {
            const text = 'const x = 5;\nconsole.log(x};';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should return only general patterns for unknown languages', () => {
            const unknownPatterns = getLogPatterns('unknownlang');
            const generalPatterns = getLogPatterns('general');

            expect(generalPatterns.length).toBe(unknownPatterns.length);
            expect(generalPatterns).toEqual(unknownPatterns);
        });

        it('should include custom patterns for the given language', () => {
            const mockedGetAllCustomPatterns = vi.mocked(getAllCustomPatterns);

            mockedGetAllCustomPatterns.mockReturnValue([
                {
                    language: 'typescript',
                    name: 'My Custom Log',
                    pattern: 'myCustomLog\\$',
                },
            ]);

            const patterns = getLogPatterns('typescript');

            const hasCustomPattern = patterns.some(pattern => pattern === 'myCustomLog\\$');

            expect(hasCustomPattern).toBe(true);
        });

        it('should handle empty text', () => {
            const text = '';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });
    });

    describe('findMatchesWithPattern', () => {
        it('should find matches with a simple pattern pattern', () => {
            const text = 'console.log("test");\nconsole.log("another");';
            const pattern = 'console.log';
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithPattern(text, pattern, editor);

            expect(results.length).toBe(2);
            expect(results[0]?.range).toBeDefined();
        });

        it('should return empty array when no matches found', () => {
            const text = 'const x = 5;\nconst y = 10;';
            const pattern = 'console.log';
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithPattern(text, pattern, editor);

            expect(results.length).toBe(0);
        });

        it('should handle multiple matches on same line', () => {
            const text = 'console.log("a"); console.log("b");';
            const pattern = 'console.log';
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithPattern(text, pattern, editor);

            expect(results.length).toBe(2);
        });

        it('should correctly calculate positions for matches', () => {
            const text = 'console.log("test");';
            const pattern = 'console.log';
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithPattern(text, pattern, editor);

            expect(results.length).toBe(1);
            expect(results[0]?.range.start.line).toBe(0);
            expect(results[0]?.range.start.character).toBe(0);
        });

        it('should handle empty text', () => {
            const text = '';
            const pattern = 'console.log';
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithPattern(text, pattern, editor);

            expect(results.length).toBe(0);
        });
    });

    describe('getLogPatterns', () => {
        it('should return typescript patterns for typescript language', () => {
            const patterns = getLogPatterns('typescript');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should return javascript patterns for javascript language', () => {
            const patterns = getLogPatterns('javascript');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should map javascriptreact to javascript patterns', () => {
            const jsPatterns = getLogPatterns('javascript');
            const jsxPatterns = getLogPatterns('javascriptreact');

            expect(jsxPatterns.length).toBe(jsPatterns.length);
        });

        it('should return go patterns for go language', () => {
            const patterns = getLogPatterns('go');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should return general patterns for unknown languages', () => {
            const unknownPatterns = getLogPatterns('unknownlang');
            const generalPatterns = getLogPatterns('general');

            expect(unknownPatterns).toEqual(generalPatterns);
        });

        it('should include general patterns for all languages', () => {
            const patterns = getLogPatterns('typescript');

            expect(patterns.length).toBeGreaterThan(2);
        });

        it('should return string array', () => {
            const patterns = getLogPatterns('typescript');

            patterns.forEach(pattern => {
                expect(typeof pattern).toBe('string');
            });
        });

        it('should return cpp patterns for cpp language', () => {
            const patterns = getLogPatterns('cpp');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should include custom patterns for the given language', () => {
            const mockedGetAllCustomPatterns = vi.mocked(getAllCustomPatterns);

            mockedGetAllCustomPatterns.mockReturnValue([
                {
                    language: 'typescript',
                    name: 'My Custom Log',
                    pattern: 'myCustomLog\\$',
                },
            ]);

            const patterns = getLogPatterns('typescript');

            const hasCustomPattern = patterns.some(pattern => pattern === 'myCustomLog\\$');

            expect(hasCustomPattern).toBe(true);
        });

        it('should not include custom patterns for different languages', () => {
            const mockedGetAllCustomPatterns = vi.mocked(getAllCustomPatterns);

            mockedGetAllCustomPatterns.mockReturnValue([
                {
                    language: 'javascript',
                    name: 'JS Custom Log',
                    pattern: 'jsCustomLog\\$',
                },
            ]);

            const patterns = getLogPatterns('typescript');

            const hasCustomPattern = patterns.some(pattern => pattern === 'jsCustomLog\\$');

            expect(hasCustomPattern).toBe(false);
        });
    });
});
