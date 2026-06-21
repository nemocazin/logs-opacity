import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../patterns';

describe('Log Patterns', () => {
    type Language = keyof typeof LOG_PATTERNS;

    /**
     * @brief Test a specific pattern against a given text.
     *
     * @param language The language key in LOG_PATTERNS
     * @param index The index of the pattern
     * @param text The text to test against the pattern
     */
    function testPattern(language: Language, index: number, text: string) {
        const pattern = LOG_PATTERNS[language][index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    type TestCase = {
        description: string;
        patternIndex: number;
        samples: string[];
    };

    const testSuites: Record<Language, { suiteName: string; cases: TestCase[] }> = {
        general: {
            suiteName: 'general patterns',
            cases: [
                {
                    description: 'log.info statements',
                    patternIndex: 0,
                    samples: [
                        'log.info("test");',
                        'log.info(JSON.stringify({name: "John"}));',
                        'log.info     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.debug statements',
                    patternIndex: 1,
                    samples: [
                        'log.debug("test");',
                        'log.debug(JSON.stringify({name: "John"}));',
                        'log.debug     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.verbose statements',
                    patternIndex: 2,
                    samples: [
                        'log.verbose("test");',
                        'log.verbose(JSON.stringify({name: "John"}));',
                        'log.verbose     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.warn statements',
                    patternIndex: 3,
                    samples: [
                        'log.warn("test");',
                        'log.warn(JSON.stringify({name: "John"}));',
                        'log.warn     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.error statements',
                    patternIndex: 4,
                    samples: [
                        'log.error("test");',
                        'log.error(JSON.stringify({name: "John"}));',
                        'log.error     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.fatal statements',
                    patternIndex: 5,
                    samples: [
                        'log.fatal("test");',
                        'log.fatal(JSON.stringify({name: "John"}));',
                        'log.fatal     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'log.panic statements',
                    patternIndex: 6,
                    samples: [
                        'log.panic("test");',
                        'log.panic(JSON.stringify({name: "John"}));',
                        'log.panic     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.info statements',
                    patternIndex: 7,
                    samples: [
                        'Log.info("test");',
                        'Log.info(JSON.stringify({name: "John"}));',
                        'Log.info     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.debug statements',
                    patternIndex: 8,
                    samples: [
                        'Log.debug("test");',
                        'Log.debug(JSON.stringify({name: "John"}));',
                        'Log.debug     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.verbose statements',
                    patternIndex: 9,
                    samples: [
                        'Log.verbose("test");',
                        'Log.verbose(JSON.stringify({name: "John"}));',
                        'Log.verbose     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.warn statements',
                    patternIndex: 10,
                    samples: [
                        'Log.warn("test");',
                        'Log.warn(JSON.stringify({name: "John"}));',
                        'Log.warn     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.error statements',
                    patternIndex: 11,
                    samples: [
                        'Log.error("test");',
                        'Log.error(JSON.stringify({name: "John"}));',
                        'Log.error     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.fatal statements',
                    patternIndex: 12,
                    samples: [
                        'Log.fatal("test");',
                        'Log.fatal(JSON.stringify({name: "John"}));',
                        'Log.fatal     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'Log.panic statements',
                    patternIndex: 13,
                    samples: [
                        'Log.panic("test");',
                        'Log.panic(JSON.stringify({name: "John"}));',
                        'Log.panic     (JSON.stringify(obj));',
                    ],
                },
            ],
        },

        go: {
            suiteName: 'go patterns - logger',
            cases: [
                {
                    description: 'logger.Info statements',
                    patternIndex: 0,
                    samples: [
                        'logger.Info("test")',
                        'logger.Info(JSON.stringify({name: "John"}));',
                        'logger.Info     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Debug statements',
                    patternIndex: 1,
                    samples: [
                        'logger.Debug("debug")',
                        'logger.Debug(JSON.stringify({name: "John"}));',
                        'logger.Debug     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Error statements',
                    patternIndex: 2,
                    samples: [
                        'logger.Error("error")',
                        'logger.Error(JSON.stringify({name: "John"}));',
                        'logger.Error     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Warn statements',
                    patternIndex: 3,
                    samples: [
                        'logger.Warn("warning")',
                        'logger.Warn(JSON.stringify({name: "John"}));',
                        'logger.Warn     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Trace statements',
                    patternIndex: 4,
                    samples: [
                        'logger.Trace("trace")',
                        'logger.Trace(JSON.stringify({name: "John"}));',
                        'logger.Trace     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Fatal statements',
                    patternIndex: 5,
                    samples: [
                        'logger.Fatal("fatal")',
                        'logger.Fatal(JSON.stringify({name: "John"}));',
                        'logger.Fatal     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'logger.Panic statements',
                    patternIndex: 6,
                    samples: [
                        'logger.Panic("panic")',
                        'logger.Panic(JSON.stringify({name: "John"}));',
                        'logger.Panic     (JSON.stringify(obj));',
                    ],
                },
            ],
        },

        javascript: {
            suiteName: 'javascript patterns',
            cases: [
                {
                    description: 'console.log statements',
                    patternIndex: 0,
                    samples: [
                        'console.log("test");',
                        'console.log(JSON.stringify({name: "John"}));',
                        'console.log     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.error statements',
                    patternIndex: 1,
                    samples: [
                        'console.error("test");',
                        'console.error(JSON.stringify({name: "John"}));',
                        'console.error     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.warn statements',
                    patternIndex: 2,
                    samples: [
                        'console.warn("test");',
                        'console.warn(JSON.stringify({name: "John"}));',
                        'console.warn     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.info statements',
                    patternIndex: 3,
                    samples: [
                        'console.info("test");',
                        'console.info(JSON.stringify({name: "John"}));',
                        'console.info     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.debug statements',
                    patternIndex: 4,
                    samples: [
                        'console.debug("test");',
                        'console.debug(JSON.stringify({name: "John"}));',
                        'console.debug     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.trace statements',
                    patternIndex: 5,
                    samples: [
                        'console.trace("test");',
                        'console.trace(JSON.stringify({name: "John"}));',
                        'console.trace     (JSON.stringify(obj));',
                    ],
                },
            ],
        },

        typescript: {
            suiteName: 'typescript patterns',
            cases: [
                {
                    description: 'console.log statements',
                    patternIndex: 0,
                    samples: [
                        'console.log("test");',
                        'console.log(JSON.stringify({name: "John"}));',
                        'console.log     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.error statements',
                    patternIndex: 1,
                    samples: [
                        'console.error("test");',
                        'console.error(JSON.stringify({name: "John"}));',
                        'console.error     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.warn statements',
                    patternIndex: 2,
                    samples: [
                        'console.warn("test");',
                        'console.warn(JSON.stringify({name: "John"}));',
                        'console.warn     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.info statements',
                    patternIndex: 3,
                    samples: [
                        'console.info("test");',
                        'console.info(JSON.stringify({name: "John"}));',
                        'console.info     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.debug statements',
                    patternIndex: 4,
                    samples: [
                        'console.debug("test");',
                        'console.debug(JSON.stringify({name: "John"}));',
                        'console.debug     (JSON.stringify(obj));',
                    ],
                },
                {
                    description: 'console.trace statements',
                    patternIndex: 5,
                    samples: [
                        'console.trace("test");',
                        'console.trace(JSON.stringify({name: "John"}));',
                        'console.trace     (JSON.stringify(obj));',
                    ],
                },
            ],
        },
    };

    (Object.entries(testSuites) as [Language, { suiteName: string; cases: TestCase[] }][]).forEach(
        ([language, { suiteName, cases }]) => {
            describe(suiteName, () => {
                cases.forEach(({ description, patternIndex, samples }) => {
                    it(`should match ${description}`, () => {
                        samples.forEach(sample => testPattern(language, patternIndex, sample));
                    });
                });
            });
        },
    );
});
