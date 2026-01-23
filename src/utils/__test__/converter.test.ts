import { describe, it, expect } from 'vitest';
import { convertOpacityToHex } from '../converter';

describe('convertOpacityToHex', () => {
    it('should convert 0 opacity to 00', () => {
        expect(convertOpacityToHex(0)).toBe('00');
    });

    it('should convert 50 opacity to 80', () => {
        expect(convertOpacityToHex(50)).toBe('80');
    });

    it('should convert 100 opacity to ff', () => {
        expect(convertOpacityToHex(100)).toBe('ff');
    });

    it('should convert 25 opacity to 40', () => {
        expect(convertOpacityToHex(25)).toBe('40');
    });

    it('should convert 75 opacity to bf', () => {
        expect(convertOpacityToHex(75)).toBe('bf');
    });

    it('should handle decimal values', () => {
        expect(convertOpacityToHex(33.33)).toBe('55');
    });

    it('should pad single digit hex values', () => {
        expect(convertOpacityToHex(1)).toBe('03');
    });
});
