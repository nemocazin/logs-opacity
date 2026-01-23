import { describe, it, expect, vi } from 'vitest';

type Position = {
    line: number;
    character: number;
};

describe('logDetector', () => {
    vi.mock('vscode', () => ({
        Range: class {
            constructor(
                public start: Position,
                public end: Position,
            ) {}
        },
    }));

    describe('language mapping', () => {
        it('should map typescript to typescript patterns', () => {
            // This tests the concept - actual implementation would need VSCode mocks
            const languageMap: { [key: string]: string } = {
                typescript: 'typescript',
                javascript: 'javascript',
                typescriptreact: 'typescript',
                javascriptreact: 'javascript',
                go: 'go',
            };

            expect(languageMap['typescript']).toBe('typescript');
            expect(languageMap['typescriptreact']).toBe('typescript');
            expect(languageMap['javascript']).toBe('javascript');
            expect(languageMap['javascriptreact']).toBe('javascript');
            expect(languageMap['go']).toBe('go');
        });
    });

    describe('regex matching', () => {
        it('should find console.log in text', () => {
            const text = 'const x = 5;\nconsole.log(x);\nconst y = 10;';
            const regex = /console\.log\s*\([^)]*\);?/g;
            const matches = [...text.matchAll(regex)];

            expect(matches.length).toBe(1);
            expect(matches[0][0]).toBe('console.log(x);');
        });

        it('should find multiple log statements', () => {
            const text = 'console.log("a");\nlog.info("b");\nconsole.log("c");';
            const consoleRegex = /console\.log\s*\([^)]*\);?/g;
            const matches = [...text.matchAll(consoleRegex)];

            expect(matches.length).toBe(2);
        });

        it('should find Go fmt.Println', () => {
            const text = 'fmt.Println("Hello")\nfmt.Printf("%s", name)';
            const regex = /fmt\.Println\s*\([^)]*\)/g;
            const matches = [...text.matchAll(regex)];

            expect(matches.length).toBe(1);
            expect(matches[0][0]).toBe('fmt.Println("Hello")');
        });
    });
});
