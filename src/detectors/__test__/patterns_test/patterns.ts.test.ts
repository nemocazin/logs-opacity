import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('typescript patterns', () => {
        it('should match console.log statements', () => {
            const pattern = LOG_PATTERNS.typescript[0];
            const text = 'console.log("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
            expect(matches?.[0]).toBe('console.log("test");');
        });

        it('should match console.log without semicolon', () => {
            const pattern = LOG_PATTERNS.typescript[0];
            const text = 'console.log("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.info statements', () => {
            const pattern = LOG_PATTERNS.typescript[1];
            const text = 'log.info("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.debug statements', () => {
            const pattern = LOG_PATTERNS.typescript[1];
            const text = 'log.debug("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.verbose statements', () => {
            const pattern = LOG_PATTERNS.typescript[1];
            const text = 'log.verbose("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.warn statements', () => {
            const pattern = LOG_PATTERNS.typescript[1];
            const text = 'log.warn("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.error statements', () => {
            const pattern = LOG_PATTERNS.typescript[1];
            const text = 'log.error("test");';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });
    });
});
