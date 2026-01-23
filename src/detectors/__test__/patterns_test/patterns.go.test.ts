import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('go patterns', () => {
        it('should match log.Println statements', () => {
            const pattern = LOG_PATTERNS.go[0];
            const text = 'log.Println("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Printf statements', () => {
            const pattern = LOG_PATTERNS.go[1];
            const text = 'log.Printf("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Print statements', () => {
            const pattern = LOG_PATTERNS.go[2];
            const text = 'log.Print("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Fatal statements', () => {
            const pattern = LOG_PATTERNS.go[3];
            const text = 'log.Fatal("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Fatalf statements', () => {
            const pattern = LOG_PATTERNS.go[4];
            const text = 'log.Fatalf("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Panic statements', () => {
            const pattern = LOG_PATTERNS.go[5];
            const text = 'log.Panic("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });

        it('should match log.Panic statements', () => {
            const pattern = LOG_PATTERNS.go[6];
            const text = 'log.Panicf("test")';
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        });
    });
});
