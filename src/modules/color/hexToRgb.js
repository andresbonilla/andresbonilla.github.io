/**
 * Returns a color in RGB format given a number in hex format
 * @param {string} hexColor - The color to find contrast with in hex format
 * @returns {Object} {r, g, b}
 */
export const hexToRgb = (hexColor) => {
  if (!hexColor || hexColor === undefined || hexColor === '') {
    return undefined
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : undefined
}
