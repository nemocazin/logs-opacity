/**
 * Converts an opacity percentage (0-100) to a hexadecimal string (00-FF).
 *
 * @param opacity The opacity value between 0 and 100.
 * @returns The hexadecimal representation of the opacity.
 */
export function convertOpacityToHex(opacity: number): string {
    return Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');
}
