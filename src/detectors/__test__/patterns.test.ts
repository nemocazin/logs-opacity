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
                        'log.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.debug statements',
                    patternIndex: 1,
                    samples: [
                        'log.debug("test");',
                        'log.debug(JSON.stringify({name: "John"}));',
                        'log.debug     (JSON.stringify(obj));',
                        'log.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.verbose statements',
                    patternIndex: 2,
                    samples: [
                        'log.verbose("test");',
                        'log.verbose(JSON.stringify({name: "John"}));',
                        'log.verbose     (JSON.stringify(obj));',
                        'log.verbose().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.verbose().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.warn statements',
                    patternIndex: 3,
                    samples: [
                        'log.warn("test");',
                        'log.warn(JSON.stringify({name: "John"}));',
                        'log.warn     (JSON.stringify(obj));',
                        'log.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.error statements',
                    patternIndex: 4,
                    samples: [
                        'log.error("test");',
                        'log.error(JSON.stringify({name: "John"}));',
                        'log.error     (JSON.stringify(obj));',
                        'log.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.fatal statements',
                    patternIndex: 5,
                    samples: [
                        'log.fatal("test");',
                        'log.fatal(JSON.stringify({name: "John"}));',
                        'log.fatal     (JSON.stringify(obj));',
                        'log.fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'log.panic statements',
                    patternIndex: 6,
                    samples: [
                        'log.panic("test");',
                        'log.panic(JSON.stringify({name: "John"}));',
                        'log.panic     (JSON.stringify(obj));',
                        'log.panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'log.panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.info statements',
                    patternIndex: 7,
                    samples: [
                        'Log.info("test");',
                        'Log.info(JSON.stringify({name: "John"}));',
                        'Log.info     (JSON.stringify(obj));',
                        'Log.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.debug statements',
                    patternIndex: 8,
                    samples: [
                        'Log.debug("test");',
                        'Log.debug(JSON.stringify({name: "John"}));',
                        'Log.debug     (JSON.stringify(obj));',
                        'Log.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.verbose statements',
                    patternIndex: 9,
                    samples: [
                        'Log.verbose("test");',
                        'Log.verbose(JSON.stringify({name: "John"}));',
                        'Log.verbose     (JSON.stringify(obj));',
                        'Log.verbose().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.verbose().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.warn statements',
                    patternIndex: 10,
                    samples: [
                        'Log.warn("test");',
                        'Log.warn(JSON.stringify({name: "John"}));',
                        'Log.warn     (JSON.stringify(obj));',
                        'Log.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.error statements',
                    patternIndex: 11,
                    samples: [
                        'Log.error("test");',
                        'Log.error(JSON.stringify({name: "John"}));',
                        'Log.error     (JSON.stringify(obj));',
                        'Log.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.fatal statements',
                    patternIndex: 12,
                    samples: [
                        'Log.fatal("test");',
                        'Log.fatal(JSON.stringify({name: "John"}));',
                        'Log.fatal     (JSON.stringify(obj));',
                        'Log.fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'Log.panic statements',
                    patternIndex: 13,
                    samples: [
                        'Log.panic("test");',
                        'Log.panic(JSON.stringify({name: "John"}));',
                        'Log.panic     (JSON.stringify(obj));',
                        'Log.panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'Log.panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
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
                        'logger.Info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Debug statements',
                    patternIndex: 1,
                    samples: [
                        'logger.Debug("debug")',
                        'logger.Debug(JSON.stringify({name: "John"}));',
                        'logger.Debug     (JSON.stringify(obj));',
                        'logger.Debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Error statements',
                    patternIndex: 2,
                    samples: [
                        'logger.Error("error")',
                        'logger.Error(JSON.stringify({name: "John"}));',
                        'logger.Error     (JSON.stringify(obj));',
                        'logger.Error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Warn statements',
                    patternIndex: 3,
                    samples: [
                        'logger.Warn("warning")',
                        'logger.Warn(JSON.stringify({name: "John"}));',
                        'logger.Warn     (JSON.stringify(obj));',
                        'logger.Warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Trace statements',
                    patternIndex: 4,
                    samples: [
                        'logger.Trace("trace")',
                        'logger.Trace(JSON.stringify({name: "John"}));',
                        'logger.Trace     (JSON.stringify(obj));',
                        'logger.Trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Fatal statements',
                    patternIndex: 5,
                    samples: [
                        'logger.Fatal("fatal")',
                        'logger.Fatal(JSON.stringify({name: "John"}));',
                        'logger.Fatal     (JSON.stringify(obj));',
                        'logger.Fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Fatal().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'logger.Panic statements',
                    patternIndex: 6,
                    samples: [
                        'logger.Panic("panic")',
                        'logger.Panic(JSON.stringify({name: "John"}));',
                        'logger.Panic     (JSON.stringify(obj));',
                        'logger.Panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'logger.Panic().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
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
                        'console.log().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.log().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.error statements',
                    patternIndex: 1,
                    samples: [
                        'console.error("test");',
                        'console.error(JSON.stringify({name: "John"}));',
                        'console.error     (JSON.stringify(obj));',
                        'console.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.warn statements',
                    patternIndex: 2,
                    samples: [
                        'console.warn("test");',
                        'console.warn(JSON.stringify({name: "John"}));',
                        'console.warn     (JSON.stringify(obj));',
                        'console.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.info statements',
                    patternIndex: 3,
                    samples: [
                        'console.info("test");',
                        'console.info(JSON.stringify({name: "John"}));',
                        'console.info     (JSON.stringify(obj));',
                        'console.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.debug statements',
                    patternIndex: 4,
                    samples: [
                        'console.debug("test");',
                        'console.debug(JSON.stringify({name: "John"}));',
                        'console.debug     (JSON.stringify(obj));',
                        'console.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.trace statements',
                    patternIndex: 5,
                    samples: [
                        'console.trace("test");',
                        'console.trace(JSON.stringify({name: "John"}));',
                        'console.trace     (JSON.stringify(obj));',
                        'console.trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
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
                        'console.log().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.log().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.error statements',
                    patternIndex: 1,
                    samples: [
                        'console.error("test");',
                        'console.error(JSON.stringify({name: "John"}));',
                        'console.error     (JSON.stringify(obj));',
                        'console.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.error().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.warn statements',
                    patternIndex: 2,
                    samples: [
                        'console.warn("test");',
                        'console.warn(JSON.stringify({name: "John"}));',
                        'console.warn     (JSON.stringify(obj));',
                        'console.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.warn().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.info statements',
                    patternIndex: 3,
                    samples: [
                        'console.info("test");',
                        'console.info(JSON.stringify({name: "John"}));',
                        'console.info     (JSON.stringify(obj));',
                        'console.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.info().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.debug statements',
                    patternIndex: 4,
                    samples: [
                        'console.debug("test");',
                        'console.debug(JSON.stringify({name: "John"}));',
                        'console.debug     (JSON.stringify(obj));',
                        'console.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.debug().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
                    ],
                },
                {
                    description: 'console.trace statements',
                    patternIndex: 5,
                    samples: [
                        'console.trace("test");',
                        'console.trace(JSON.stringify({name: "John"}));',
                        'console.trace     (JSON.stringify(obj));',
                        'console.trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test");',
                        'console.trace().Str("value :", value).Any("obj", {bar: 1, foo: 10}).Msg("Test")',
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
