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
        const pattern = LOG_PATTERNS.general[index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    describe('log patterns (lowercase)', () => {
        it('should match log.info statements', () => {
            testPattern(0, 'log.info("test");');
            testPattern(0, 'log.info(JSON.stringify({name: "John"}));');
            testPattern(0, 'log.info     (JSON.stringify(obj));');
        });

        it('should match log.debug statements', () => {
            testPattern(1, 'log.debug("test");');
            testPattern(1, 'log.debug(JSON.stringify({name: "John"}));');
            testPattern(1, 'log.debug     (JSON.stringify(obj));');
        });

        it('should match log.verbose statements', () => {
            testPattern(2, 'log.verbose("test");');
            testPattern(2, 'log.verbose(JSON.stringify({name: "John"}));');
            testPattern(2, 'log.verbose     (JSON.stringify(obj));');
        });

        it('should match log.warn statements', () => {
            testPattern(3, 'log.warn("test");');
            testPattern(3, 'log.warn(JSON.stringify({name: "John"}));');
            testPattern(3, 'log.warn     (JSON.stringify(obj));');
        });

        it('should match log.error statements', () => {
            testPattern(4, 'log.error("test");');
            testPattern(4, 'log.error(JSON.stringify({name: "John"}));');
            testPattern(4, 'log.error     (JSON.stringify(obj));');
        });

        it('should match log.fatal statements', () => {
            testPattern(5, 'log.fatal("test");');
            testPattern(5, 'log.fatal(JSON.stringify({name: "John"}));');
            testPattern(5, 'log.fatal     (JSON.stringify(obj));');
        });

        it('should match log.panic statements', () => {
            testPattern(6, 'log.panic("test");');
            testPattern(6, 'log.panic(JSON.stringify({name: "John"}));');
            testPattern(6, 'log.panic     (JSON.stringify(obj));');
        });
    });

    describe('Log patterns (uppercase)', () => {
        it('should match Log.info statements', () => {
            testPattern(7, 'Log.info("test");');
            testPattern(7, 'Log.info(JSON.stringify({name: "John"}));');
            testPattern(7, 'Log.info     (JSON.stringify(obj));');
        });

        it('should match Log.debug statements', () => {
            testPattern(8, 'Log.debug("test");');
            testPattern(8, 'Log.debug(JSON.stringify({name: "John"}));');
            testPattern(8, 'Log.debug     (JSON.stringify(obj));');
        });

        it('should match Log.verbose statements', () => {
            testPattern(9, 'Log.verbose("test");');
            testPattern(9, 'Log.verbose(JSON.stringify({name: "John"}));');
            testPattern(9, 'Log.verbose     (JSON.stringify(obj));');
        });

        it('should match Log.warn statements', () => {
            testPattern(10, 'Log.warn("test");');
            testPattern(10, 'Log.warn(JSON.stringify({name: "John"}));');
            testPattern(10, 'Log.warn     (JSON.stringify(obj));');
        });

        it('should match Log.error statements', () => {
            testPattern(11, 'Log.error("test");');
            testPattern(11, 'Log.error(JSON.stringify({name: "John"}));');
            testPattern(11, 'Log.error     (JSON.stringify(obj));');
        });

        it('should match Log.fatal statements', () => {
            testPattern(12, 'Log.fatal("test");');
            testPattern(12, 'Log.fatal(JSON.stringify({name: "John"}));');
            testPattern(12, 'Log.fatal     (JSON.stringify(obj));');
        });

        it('should match Log.panic statements', () => {
            testPattern(13, 'Log.panic("test");');
            testPattern(13, 'Log.panic(JSON.stringify({name: "John"}));');
            testPattern(13, 'Log.panic     (JSON.stringify(obj));');
        });
    });
});
