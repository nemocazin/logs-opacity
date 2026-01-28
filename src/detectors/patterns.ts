/**
 * Predefined log statement patterns for various programming languages.
 */
export const LOG_PATTERNS = {
    typescript: [
        /console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g,
        /\blog\.\w+\s*\([^)]*\);?/g
    ],
    javascript: [
        /console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g,
        /\blog\.\w+\s*\([^)]*\);?/g
    ],
    go: [
        /log\.Println\s*\([^)]*\)/g,
        /log\.Printf\s*\([^)]*\)/g,
        /log\.Print\s*\([^)]*\)/g,
        /log\.Fatal\s*\([^)]*\)/g,
        /log\.Fatalf\s*\([^)]*\)/g,
        /log\.Panic\s*\([^)]*\)/g,
        /log\.Panicf\s*\([^)]*\)/g,
    ],
};
