import * as vscode from 'vscode';
import { LOG_PATTERNS } from './patterns';
import { getAllCustomRegexes } from '../config/configManager';

/**
 * Finds log statements in the given text editor based on predefined patterns.
 *
 * @param editor The text editor to search for log statements.
 * @returns An array of decoration options representing the ranges of log statements.
 */
export function findLogStatements(editor: vscode.TextEditor): vscode.DecorationOptions[] {
    const text = editor.document.getText();
    const languageId = editor.document.languageId;
    const patterns = getLogPatterns(languageId);

    const logRanges: vscode.DecorationOptions[] = [];

    // Apply each regex pattern to find log statements
    patterns.forEach(regex => {
        const ranges = findMatchesWithRegex(text, regex, editor);
        logRanges.push(...ranges);
    });

    return logRanges;
}

/**
 * Finds all matches of a regex in the given text and returns their ranges.
 *
 * @param text The text to search in.
 * @param regex The regex pattern to search for.
 * @param editor The text editor containing the text.
 * @returns An array of decoration options for each match found.
 */
export function findMatchesWithRegex(
    text: string,
    regex: RegExp,
    editor: vscode.TextEditor,
): vscode.DecorationOptions[] {
    const ranges: vscode.DecorationOptions[] = [];
    const globalRegex = ensureGlobalFlag(regex);
    let match;

    while ((match = globalRegex.exec(text))) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);
        ranges.push({ range: new vscode.Range(startPos, endPos) });
    }

    return ranges;
}

/**
 * Retrieves log patterns based on the language ID.
 *
 * @param languageId The language ID of the document.
 * @returns An array of regex patterns for the specified language.
 */
export function getLogPatterns(languageId: string): RegExp[] {
    const languageMap: { [key: string]: keyof typeof LOG_PATTERNS } = {
        typescript: 'typescript',
        javascript: 'javascript',
        typescriptreact: 'typescript',
        javascriptreact: 'javascript',
        go: 'go',
        cpp: 'cpp',
    };

    // Get patterns for the language
    const patternKey = languageMap[languageId];

    // Get all patterns: language-specific, custom regexes for the language, and general patterns
    const languagePatterns = patternKey ? LOG_PATTERNS[patternKey] : [];
    const customPatterns = getAllCustomRegexes().filter(regex => regex.language === languageId);
    const generalPatterns = LOG_PATTERNS.general;

    // Combine all patterns into a single array
    const allPatterns = [...languagePatterns, ...customPatterns.map(r => new RegExp(r.pattern)), ...generalPatterns];

    return allPatterns;
}

/**
 * Ensures a regex has the global flag set.
 *
 * @param regex The regex pattern to check.
 * @returns A new regex with the global flag added if it wasn't present.
 */
export function ensureGlobalFlag(regex: RegExp): RegExp {
    if (regex.global) {
        return regex;
    }
    return new RegExp(regex.source, regex.flags + 'g');
}
