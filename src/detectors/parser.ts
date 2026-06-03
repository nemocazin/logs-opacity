/**
 * @brief Finds the index of the opening parenthesis following the search pattern, ignoring whitespace.
 *
 * @param text The text to search within.
 * @param startIndex The index where the search pattern was found.
 * @param search The search pattern that was found.
 * @returns The index of the opening parenthesis if found, otherwise -1.
 */
export function findOpeningParenthesis(text: string, startIndex: number, search: string): number {
    let checkIndex = startIndex + search.length;

    // Skip any whitespace characters after the search pattern
    while (checkIndex < text.length) {
        const char = text[checkIndex];
        if (char === undefined || !/\s/.test(char)) break;
        checkIndex++;
    }

    return text[checkIndex] === '(' ? checkIndex : -1;
}

/**
 * @brief Finds the index of the closing parenthesis corresponding to the opening one, handling nested parentheses.
 *
 * @param text The text to search within.
 * @param openParenIndex The index of the opening parenthesis.
 * @returns The index of the closing parenthesis if found, otherwise -1.
 */
export function findClosingParenthesis(text: string, openParenIndex: number): number {
    const closingIndex = findMatchingClosingParenthesis(text, openParenIndex);

    // If the initial closing parenthesis is not found, return -1
    if (closingIndex === -1) {
        return -1;
    }

    return findEndOfChainedCalls(text, closingIndex);
}

/**
 * @brief Finds the index of the closing parenthesis that matches the opening parenthesis
 *
 * @param text The text to search within.
 * @param openParenIndex The index of the opening parenthesis.
 * @returns The index of the matching closing parenthesis, or -1 if not found.
 */
function findMatchingClosingParenthesis(text: string, openParenIndex: number): number {
    let currentIndex = openParenIndex + 1;
    let depth = 1;

    // Traverse the text to find the matching closing parenthesis, accounting for nested parentheses
    while (currentIndex < text.length && depth > 0) {
        const char = text[currentIndex];

        if (char === '(') {
            depth++;
        } else if (char === ')') {
            depth--;
        }

        currentIndex++;
    }

    return depth === 0 ? currentIndex - 1 : -1;
}

/**
 * @brief Finds the index of the end of chained calls following a log statement
 *
 * @param text The text to search within.
 * @param initialEndIndex The index where the initial log statement ends.
 * @returns The index of the end of the last chained call.
 */
function findEndOfChainedCalls(text: string, initialEndIndex: number): number {
    let endIndex = initialEndIndex;

    // Continuously check for chained calls until no more are found
    while (true) {
        // Find the index of the next chained call after the current end index
        const nextOpenParen = findNextChainedCall(text, endIndex);

        if (nextOpenParen === -1) {
            break;
        }

        // Find the corresponding closing parenthesis for the chained call
        const chainedEnd = findMatchingClosingParenthesis(text, nextOpenParen);

        if (chainedEnd === -1) {
            break;
        }

        endIndex = chainedEnd;
    }

    return endIndex + 1;
}

/**
 * @brief Finds the index of the next chained call after a log statement, if it exists.
 *
 * @param text The text to search within.
 * @param endIndex The index where the initial log statement ends.
 * @returns The index of the opening parenthesis of the next chained call, or -1 if not found.
 */
function findNextChainedCall(text: string, endIndex: number): number {
    let index = skipWhitespace(text, endIndex + 1);

    // Check for a dot indicating a chained call
    if (text[index] !== '.') {
        return -1;
    }

    index++;

    // Skip any whitespace after the to get the index of the next opening parenthesis
    index = skipIdentifier(text, index);
    index = skipWhitespace(text, index);

    return text[index] === '(' ? index : -1;
}

/**
 * @brief Skips whitespace characters in the text starting from the given index.
 *
 * @param text The text to search within.
 * @param startIndex The index to start skipping from.
 * @returns The index of the first non-whitespace character after the given index.
 */
function skipWhitespace(text: string, startIndex: number): number {
    let index = startIndex;

    // Skip any whitespace characters after the given index
    while (index < text.length && /\s/.test(text[index]!)) {
        index++;
    }

    return index;
}

/**
 * @brief Skips identifier characters (letters, digits, underscores, and dollar signs) in the text starting from the given index.
 *
 * @param text The text to search within.
 * @param startIndex The index to start skipping from.
 * @returns The index of the first character that is not an identifier character after the given index.
 */
function skipIdentifier(text: string, startIndex: number): number {
    let index = startIndex;

    // Skip any identifier characters (letters, digits, underscores, and dollar signs) after the given index
    while (index < text.length && /[a-zA-Z0-9_$]/.test(text[index]!)) {
        index++;
    }

    return index;
}
