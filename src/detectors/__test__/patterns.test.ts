import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../patterns';

type Language = keyof typeof LOG_PATTERNS;

/**
 * Tests a specific pattern from LOG_PATTERNS against a given text.
 *
 * @param language - The language key in LOG_PATTERNS
 * @param index - The index of the pattern to test
 * @param text - The text to match against the pattern
 */
function testPattern(language: Language, index: number, text: string): void {
    const pattern = LOG_PATTERNS[language][index];
    expect(pattern).toBeDefined();
    if (pattern) {
        expect(text.match(pattern)).not.toBeNull();
    }
}

/**
 * Generates a standard set of sample log statements for a given prefix and method.
 *
 * @param prefix - The object prefix (e.g. `"log"`, `"logger"`, `"console"`)
 * @param method - The method name (e.g. `"info"`, `"debug"`, `"log"`)
 * @returns An array of sample strings exercising the pattern
 *
 * @example
 * buildSamples('log', 'info');
 * // [
 * //   'log.info("test");',
 * //   'log.info(JSON.stringify({name: "John"}));',
 * //   ...
 * // ]
 */
function buildSamples(prefix: string, method: string): string[] {
    return [
        `${prefix}.${method}("test");`,
        `${prefix}.${method}(JSON.stringify({name: "John"}));`,
        `${prefix}.${method}     (JSON.stringify(obj));`,
        `${prefix}.${method}().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");`,
        `${prefix}.${method}().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")`,
    ];
}

const GENERAL_METHODS = ['info', 'debug', 'verbose', 'warn', 'error', 'fatal', 'panic'] as const;
const GO_METHODS = ['Info', 'Debug', 'Error', 'Warn', 'Trace', 'Fatal', 'Panic'] as const;
const CONSOLE_METHODS = ['log', 'error', 'warn', 'info', 'debug', 'trace'] as const;

type TestCase = {
    description: string;
    patternIndex: number;
    samples: string[];
};

/** A full test suite bound to a specific language key. */
type SuiteDefinition = {
    language: Language;
    suiteName: string;
    cases: TestCase[];
};

/**
 * All test suites to run.
 *
 * - `general`: covers `log.xxx` (indices 0–6) and `Log.xxx` (indices 7–13)
 * - `go`: covers `logger.Xxx` (indices 0–6)
 * - `javascript` / `typescript`: share identical cases for `console.xxx` (indices 0–5)
 */
const suites: SuiteDefinition[] = [
    {
        language: 'general',
        suiteName: 'general patterns',
        cases: [
            // log.xxx  — pattern indices 0–6
            ...GENERAL_METHODS.map((method, i) => ({
                description: `log.${method} statements`,
                patternIndex: i,
                samples: buildSamples('log', method),
            })),
            // Log.xxx  — pattern indices 7–13
            ...GENERAL_METHODS.map((method, i) => ({
                description: `Log.${method} statements`,
                patternIndex: i + GENERAL_METHODS.length,
                samples: buildSamples('Log', method),
            })),
        ],
    },
    {
        language: 'go',
        suiteName: 'go patterns - logger',
        cases: GO_METHODS.map((method, i) => ({
            description: `logger.${method} statements`,
            patternIndex: i,
            samples: buildSamples('logger', method),
        })),
    },
    // JavaScript and TypeScript intentionally share the same cases.
    ...(['javascript', 'typescript'] as Language[]).map(language => ({
        language,
        suiteName: `${language} patterns`,
        cases: CONSOLE_METHODS.map((method, i) => ({
            description: `console.${method} statements`,
            patternIndex: i,
            samples: buildSamples('console', method),
        })),
    })),
];

describe('Log Patterns', () => {
    suites.forEach(({ language, suiteName, cases }) => {
        describe(suiteName, () => {
            cases.forEach(({ description, patternIndex, samples }) => {
                it(`should match ${description}`, () => {
                    samples.forEach(sample => testPattern(language, patternIndex, sample));
                });
            });
        });
    });
});
