/**
 * Returns a color in hex format given a color in HSL format
 * @param {number} h - The hue of the provided color, from 0 to 360
 * @param {number} s - The saturation of the provided color, from 0 to 100
 * @param {number} l - The lightness of the provided color, from 0 to 100
 * @returns {string} the color in hex format
 */
export const hslToHex = (h, s, l) => {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
