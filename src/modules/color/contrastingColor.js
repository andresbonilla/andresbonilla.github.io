const { hexToRgb } = require('./hexToRgb')
const { hexToHsl } = require('./hexToHsl')
const { rgbToYIQ } = require('./rgbToYIQ')
const { hslToHex } = require('./hslToHex')

/**
 * Returns a color that has high contrast with the provided color
 * @param {string} hexColor - The color to find contrast with in hex format
 * @param {number} threshold - The YIQ value from 0 to 255 below which a color is
 * considered 'dark', and equal or greater considered 'light'. Defaults to 128.
 * @returns {string} a color in hex format that has high contrast with hexColor
 */
export const contrastingColor = (hexColor, threshold = 128) => {
  if (hexColor === undefined) {
    return '#000000'
  }

  const { r, g, b } = hexToRgb(hexColor)
  const { h } = hexToHsl(hexColor)
  const oppositeH = (180 + h) % 360

  return rgbToYIQ(r, g, b) >= threshold
    ? hslToHex(oppositeH,  100, 0) // get dark color
    : hslToHex(oppositeH,  100, 60) // get light color
}
