import React, { useRef } from 'react'
import PropTypes from 'prop-types';
import Web3 from 'web3'

const ColorPickerForm = ({
  backgroundColor,
  foregroundColor,
  newColor,
  setNewColor,
  onSetColorClick,
  weiCostString
}) => {
  // Users can drag the mouse on the color input and cause multiple onChange
  // calls per second to fire. If we pass setNewColor directly to the color
  // input's onChange prop, it will cause excessive rendering by calling
  // setNewColor every time the color changes (multiple renders per second
  // as long as the user drags the mouse through the color selector). So
  // instead, we keep the new color in newColorRef while the color input is
  // in focus, and onBlur, we call setNewColor with the ref's current value.
  // By keeping the current color selection outside of component state while
  // the color selection is being made by the user, we prevent rendering each
  // time the color changes. We could also do this with a timeout, but onBlur
  // works fine.

  const newColorRef = useRef(newColor)

  const handleColorSelectionChange = (e) => {
    newColorRef.current = e.target.value
  }

  const handleColorSelectionBlur = () => {
    setNewColor(newColorRef.current)
  }

  return (
    <section id="color-picker-form" style={{ border: `1px solid ${foregroundColor}` }}>
      <h3>{`Change my site's background color for ${Web3.utils.fromWei(weiCostString)} ETH`}</h3>
      <input
        type="color"
        onChange={handleColorSelectionChange}
        onBlur={handleColorSelectionBlur}
        value={newColor}
      />
      <button onClick={onSetColorClick} style={{
        backgroundColor: foregroundColor,
        color: backgroundColor
      }}>Take my money</button>
    </section>
  )
}

ColorPickerForm.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  newColor: PropTypes.string.isRequired,
  setNewColor: PropTypes.func.isRequired,
  onSetColorClick: PropTypes.func.isRequired,
  weiCostString: PropTypes.string.isRequired
}

export default ColorPickerForm
