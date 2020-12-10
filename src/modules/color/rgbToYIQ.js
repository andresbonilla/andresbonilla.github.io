/**
 * Returns the YIQ value of an rgb color
 * @param {number} r - The red value of the provided color from 0 to 255
 * @param {number} g - The green value of the provided color from 0 to 255
 * @param {number} b - The blue value of the provided color from 0 to 255
 * @returns {number} the YIQ value of the provided color
 */
export const rgbToYIQ = (r, g, b) => {
  return ((r * 299) + (g * 587) + (b * 114)) / 1000
}
