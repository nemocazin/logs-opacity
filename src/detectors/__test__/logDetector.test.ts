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

describe('findLogStatements', () => {
    it.each([
        {
            name: 'detects general log patterns (log.*)',
            text: 'log.info("general log");\nlog.debug("debug log");',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThanOrEqual(2);
            },
        },
        {
            name: 'finds console.log in TypeScript',
            text: 'const x = 5;\nconsole.log(x);\nconst y = 10;',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThan(0);
                expect(results[0]?.range).toBeDefined();
            },
        },
        {
            name: 'finds multiple log statements in JavaScript',
            text: 'console.log("a");\nconsole.error("b");\nconsole.log("c");',
            languageId: 'javascript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThanOrEqual(2);
            },
        },
        {
            name: 'handles typescriptreact files',
            text: 'console.log("test");',
            languageId: 'typescriptreact',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThan(0);
            },
        },
        {
            name: 'handles javascriptreact files',
            text: 'console.log("test");',
            languageId: 'javascriptreact',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThan(0);
            },
        },
        {
            name: 'handles spaces before opening parenthesis',
            text: 'console.log      ("test");',
            languageId: 'javascriptreact',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThan(0);
            },
        },
        {
            name: 'handles nested function calls inside log',
            text: 'console.log(JSON.stringify({name: "John"}));',
            languageId: 'javascriptreact',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBeGreaterThan(0);
            },
        },
        {
            name: 'returns empty array when no logs found',
            text: 'const x = 5;\nconst y = 10;',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBe(0);
            },
        },
        {
            name: 'returns empty array when no opening parenthesis',
            text: 'const x = 5;\nconsole.log{x);',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBe(0);
            },
        },
        {
            name: 'returns empty array when no closing parenthesis',
            text: 'const x = 5;\nconsole.log(x};',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBe(0);
            },
        },
        {
            name: 'returns empty array for empty text',
            text: '',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findLogStatements>) => {
                expect(results.length).toBe(0);
            },
        },
    ])('$name', ({ text, languageId, assertion }) => {
        const editor = createMockEditor(text, languageId);
        const results = findLogStatements(editor);
        assertion(results);
    });
});

describe('findMatchesWithPattern', () => {
    it.each([
        {
            name: 'finds matches with a simple pattern',
            text: 'console.log("test");\nconsole.log("another");',
            pattern: 'console.log',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findMatchesWithPattern>) => {
                expect(results.length).toBe(2);
                expect(results[0]?.range).toBeDefined();
            },
        },
        {
            name: 'returns empty array when no matches found',
            text: 'const x = 5;\nconst y = 10;',
            pattern: 'console.log',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findMatchesWithPattern>) => {
                expect(results.length).toBe(0);
            },
        },
        {
            name: 'handles multiple matches on the same line',
            text: 'console.log("a"); console.log("b");',
            pattern: 'console.log',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findMatchesWithPattern>) => {
                expect(results.length).toBe(2);
            },
        },
        {
            name: 'correctly calculates positions for matches',
            text: 'console.log("test");',
            pattern: 'console.log',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findMatchesWithPattern>) => {
                expect(results.length).toBe(1);
                expect(results[0]?.range.start.line).toBe(0);
                expect(results[0]?.range.start.character).toBe(0);
            },
        },
        {
            name: 'handles empty text',
            text: '',
            pattern: 'console.log',
            languageId: 'typescript',
            assertion: (results: ReturnType<typeof findMatchesWithPattern>) => {
                expect(results.length).toBe(0);
            },
        },
    ])('$name', ({ text, pattern, languageId, assertion }) => {
        const editor = createMockEditor(text, languageId);
        const results = findMatchesWithPattern(text, pattern, editor);
        assertion(results);
    });
});

describe('getLogPatterns', () => {
    it.each([
        {
            name: 'returns patterns for typescript',
            language: 'typescript',
            assertion: (patterns: string[]) => {
                expect(patterns.length).toBeGreaterThan(0);
                expect(Array.isArray(patterns)).toBe(true);
            },
        },
        {
            name: 'returns patterns for javascript',
            language: 'javascript',
            assertion: (patterns: string[]) => {
                expect(patterns.length).toBeGreaterThan(0);
                expect(Array.isArray(patterns)).toBe(true);
            },
        },
        {
            name: 'maps javascriptreact to javascript patterns',
            language: 'javascriptreact',
            assertion: (patterns: string[]) => {
                const jsPatterns = getLogPatterns('javascript');
                expect(patterns.length).toBe(jsPatterns.length);
            },
        },
        {
            name: 'returns patterns for go',
            language: 'go',
            assertion: (patterns: string[]) => {
                expect(patterns.length).toBeGreaterThan(0);
                expect(Array.isArray(patterns)).toBe(true);
            },
        },
        {
            name: 'returns general patterns for unknown languages',
            language: 'unknownlang',
            assertion: (patterns: string[]) => {
                const generalPatterns = getLogPatterns('general');
                expect(patterns).toEqual(generalPatterns);
            },
        },
        {
            name: 'includes general patterns for all languages (more than 2)',
            language: 'typescript',
            assertion: (patterns: string[]) => {
                expect(patterns.length).toBeGreaterThan(2);
            },
        },
        {
            name: 'returns a string array',
            language: 'typescript',
            assertion: (patterns: string[]) => {
                patterns.forEach(pattern => {
                    expect(typeof pattern).toBe('string');
                });
            },
        },
        {
            name: 'returns patterns for cpp',
            language: 'cpp',
            assertion: (patterns: string[]) => {
                expect(patterns.length).toBeGreaterThan(0);
                expect(Array.isArray(patterns)).toBe(true);
            },
        },
    ])('$name', ({ language, assertion }) => {
        const patterns = getLogPatterns(language);
        assertion(patterns);
    });

    it('includes custom patterns for the given language', () => {
        vi.mocked(getAllCustomPatterns).mockReturnValue([
            { language: 'typescript', name: 'My Custom Log', pattern: 'myCustomLog\\$' },
        ]);
        const patterns = getLogPatterns('typescript');
        expect(patterns.some(p => p === 'myCustomLog\\$')).toBe(true);
    });

    it('does not include custom patterns for different languages', () => {
        vi.mocked(getAllCustomPatterns).mockReturnValue([
            { language: 'javascript', name: 'JS Custom Log', pattern: 'jsCustomLog\\$' },
        ]);
        const patterns = getLogPatterns('typescript');
        expect(patterns.some(p => p === 'jsCustomLog\\$')).toBe(false);
    });

    it('returns only general patterns for unknown languages', () => {
        const unknownPatterns = getLogPatterns('unknownlang');
        const generalPatterns = getLogPatterns('general');
        expect(generalPatterns.length).toBe(unknownPatterns.length);
        expect(generalPatterns).toEqual(unknownPatterns);
    });
});
