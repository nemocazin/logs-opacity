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
        const pattern = LOG_PATTERNS.typescript[index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    describe('typescript patterns', () => {
        it('should match console.log statements', () => {
            testPattern(0, 'console.log("test");');
            testPattern(0, 'console.log(JSON.stringify({name: "John"}));');
            testPattern(0, 'console.log     (JSON.stringify(obj));');
        });

        it('should match console.error statements', () => {
            testPattern(1, 'console.error("test");');
            testPattern(1, 'console.error(JSON.stringify({name: "John"}));');
            testPattern(1, 'console.error     (JSON.stringify(obj));');
        });
        it('should match console.warn statements', () => {
            testPattern(2, 'console.warn("test");');
            testPattern(2, 'console.warn(JSON.stringify({name: "John"}));');
            testPattern(2, 'console.warn     (JSON.stringify(obj));');
        });

        it('should match console.info statements', () => {
            testPattern(3, 'console.info("test");');
            testPattern(3, 'console.info(JSON.stringify({name: "John"}));');
            testPattern(3, 'console.info     (JSON.stringify(obj));');
        });

        it('should match console.debug statements', () => {
            testPattern(4, 'console.debug("test");');
            testPattern(4, 'console.debug(JSON.stringify({name: "John"}));');
            testPattern(4, 'console.debug     (JSON.stringify(obj));');
        });

        it('should match console.trace statements', () => {
            testPattern(5, 'console.trace("test");');
            testPattern(5, 'console.trace(JSON.stringify({name: "John"}));');
            testPattern(5, 'console.trace     (JSON.stringify(obj));');
        });
    });
});
