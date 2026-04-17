import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    /**
     * @brief Test a specific pattern against a given text.
     *
     * @param index The index of the pattern
     * @param text The text to test against the pattern
     */
    function testPattern(index: number, text: string) {
        const pattern = LOG_PATTERNS.go[index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    describe('go patterns - logger', () => {
        it('should match logger.Info statements', () => {
            testPattern(0, 'logger.Info("test")');
            testPattern(0, 'logger.Info(JSON.stringify({name: "John"}));');
            testPattern(0, 'logger.Info     (JSON.stringify(obj));');
        });

        it('should match logger.Debug statements', () => {
            testPattern(1, 'logger.Debug("debug")');
            testPattern(1, 'logger.Debug(JSON.stringify({name: "John"}));');
            testPattern(1, 'logger.Debug     (JSON.stringify(obj));');
        });

        it('should match logger.Error statements', () => {
            testPattern(2, 'logger.Error("error")');
            testPattern(2, 'logger.Error(JSON.stringify({name: "John"}));');
            testPattern(2, 'logger.Error     (JSON.stringify(obj));');
        });

        it('should match logger.Warn statements', () => {
            testPattern(3, 'logger.Warn("warning")');
            testPattern(3, 'logger.Warn(JSON.stringify({name: "John"}));');
            testPattern(3, 'logger.Warn     (JSON.stringify(obj));');
        });

        it('should match logger.Trace statements', () => {
            testPattern(4, 'logger.Trace("trace")');
            testPattern(4, 'logger.Trace(JSON.stringify({name: "John"}));');
            testPattern(4, 'logger.Trace     (JSON.stringify(obj));');
        });

        it('should match logger.Fatal statements', () => {
            testPattern(5, 'logger.Fatal("fatal")');
            testPattern(5, 'logger.Fatal(JSON.stringify({name: "John"}));');
            testPattern(5, 'logger.Fatal     (JSON.stringify(obj));');
        });

        it('should match logger.Panic statements', () => {
            testPattern(6, 'logger.Panic("panic")');
            testPattern(6, 'logger.Panic(JSON.stringify({name: "John"}));');
            testPattern(6, 'logger.Panic     (JSON.stringify(obj));');
        });
    });
});
