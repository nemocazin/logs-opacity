import { describe, it, expect } from 'vitest';
import { findOpeningParenthesis, findClosingParenthesis } from '../parser';

describe('findOpeningParenthesis', () => {
    const cases: Array<[description: string, text: string, startIndex: number, search: string, expected: number]> = [
        ['finds parenthesis immediately after the pattern', 'console.log(', 0, 'console.log', 11],
        ['skips a single space', 'console.log (', 0, 'console.log', 12],
        ['skips multiple spaces', 'console.log   (', 0, 'console.log', 14],
        ['skips tabs and newlines', 'console.log\t\n(', 0, 'console.log', 13],
        ['returns -1 when followed by semicolon', 'console.log;', 0, 'console.log', -1],
        ['returns -1 when text ends after the pattern', 'console.log', 0, 'console.log', -1],
        ['returns -1 when followed by a brace', 'console.log{', 0, 'console.log', -1],
        ['uses startIndex to search from mid-string', 'foo(); console.log(', 7, 'console.log', 18],
        ['works with a single-character pattern', 'f(', 0, 'f', 1],
        ['works with an empty pattern', '(', 0, '', 0],
    ];

    it.each(cases)('%s', (_desc, text, startIndex, search, expected) => {
        expect(findOpeningParenthesis(text, startIndex, search)).toBe(expected);
    });
});

describe('findClosingParenthesis', () => {
    const casesFromFirstParen: Array<[description: string, text: string, expected: number]> = [
        ['simple expression', 'log("hello")', 12],
        ['empty argument list', 'log()', 5],
        ['nested parentheses', 'log(foo(bar()))', 15],
        ['deeply nested parentheses', 'log(a(b(c(d()))))', 17],
        ['returns -1 when closing paren is missing', 'log("hello"', -1],
        ['single chained call', 'log("hello").toString()', 23],
        ['multiple chained calls', 'log("hello").trim().toString()', 30],
        ['chained call with arguments', 'log("hello").padStart(10, "*")', 30],
        ['chained call with nested parens in its args', 'log("x").replace(/(a)/g, "b")', 29],
        ['whitespace between dot and chained method name', 'log("hello"). toString()', 12],
        ['stops at semicolon, does not consume next call', 'log("hello"); foo()', 12],
        ['chained call with missing closing paren stops at first close', 'log("hello").broken(', 12],
    ];

    it.each(casesFromFirstParen)('%s', (_desc, text, expected) => {
        const open = text.indexOf('(');
        expect(findClosingParenthesis(text, open)).toBe(expected);
    });

    it('works when the opening paren is not at index 0', () => {
        const text = 'prefix log("value") suffix';
        expect(findClosingParenthesis(text, text.indexOf('('))).toBe(19);
    });
});
