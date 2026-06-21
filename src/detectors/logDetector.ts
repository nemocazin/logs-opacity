import * as vscode from 'vscode';
import { LOG_PATTERNS } from './patterns';
import { getAllCustomPatterns } from '../config/configManager';
import { findClosingParenthesis, findOpeningParenthesis } from './parser';

/**
 * @brief Finds log statements in the given text editor based on predefined patterns.
 *
 * @param editor The text editor to search for log statements.
 * @returns An array of decoration options representing the ranges of log statements.
 */
export function findLogStatements(editor: vscode.TextEditor): vscode.DecorationOptions[] {
    const text = editor.document.getText();
    const languageId = editor.document.languageId;
    const patterns = getLogPatterns(languageId);

    const logRanges: vscode.DecorationOptions[] = [];

    // Apply each pattern to find log statements
    patterns.forEach(pattern => {
        const ranges = findMatchesWithPattern(text, pattern, editor);
        logRanges.push(...ranges);
    });

    return logRanges;
}

/**
 * @brief Finds all matches of a string pattern in the given text and returns their ranges.
 *
 * @param text The text to search in.
 * @param pattern The string pattern to search for.
 * @param editor The text editor containing the text.
 * @returns An array of decoration options for each match found.
 */
export function findMatchesWithPattern(
    text: string,
    pattern: string,
    editor: vscode.TextEditor,
): vscode.DecorationOptions[] {
    const logRanges: vscode.DecorationOptions[] = [];
    let index = 0;

    // Search for the string pattern in the text
    while ((index = text.indexOf(pattern, index)) !== -1) {
        const startIndex = index;

        // Check for an opening parenthesis after the pattern to confirm it's a log statement
        const openParenIndex = findOpeningParenthesis(text, startIndex, pattern);
        if (openParenIndex === -1) {
            index = startIndex + pattern.length;
            continue;
        }

        // Find the corresponding closing parenthesis to get the full log statement
        const endIndex = findClosingParenthesis(text, openParenIndex);
        if (endIndex === -1) {
            index = startIndex + pattern.length;
            continue;
        }

        // Create a range for the log statement and add it to the results
        const range = createRange(editor, startIndex, endIndex + 1);
        logRanges.push({ range });

        index = startIndex + pattern.length;
    }

    return logRanges;
}

/**
 * @brief Creates a VSCode range from text indices.
 *
 * @param editor The text editor containing the document.
 * @param startIndex The start index of the range.
 * @param endIndex The end index of the range.
 * @returns A VSCode range object.
 */
function createRange(editor: vscode.TextEditor, startIndex: number, endIndex: number): vscode.Range {
    const startPos = editor.document.positionAt(startIndex);
    const endPos = editor.document.positionAt(endIndex);
    return new vscode.Range(startPos, endPos);
}

/**
 * @brief Retrieves log patterns based on the language ID.
 *
 * @param languageId The language ID of the document.
 * @returns An array of patterns for the specified language.
 */
export function getLogPatterns(languageId: string): string[] {
    const languageMap: { [key: string]: keyof typeof LOG_PATTERNS } = {
        typescript: 'typescript',
        javascript: 'javascript',
        typescriptreact: 'typescript',
        javascriptreact: 'javascript',
        go: 'go',
    };

    // Get patterns for the language
    const patternKey = languageMap[languageId];

    // Get all patterns: language-specific, custom patterns for the language, and general patterns
    const languagePatterns = patternKey ? LOG_PATTERNS[patternKey] : [];
    const customPatterns = getAllCustomPatterns()
        .filter(pattern => pattern.language === languageId || pattern.language === 'general')
        .map(pattern => pattern.pattern);
    const generalPatterns = LOG_PATTERNS.general;

    // Combine all patterns into a single array
    const allPatterns = [...languagePatterns, ...customPatterns, ...generalPatterns];

    return allPatterns;
}
