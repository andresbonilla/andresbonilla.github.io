import React from 'react'
import PropTypes from 'prop-types';

const Header = ({ foregroundColor }) => (
  <header style={{
    borderBottom: `1px solid ${foregroundColor}`
  }}>
    <hgroup>
      <h1>Andrés Bonilla</h1>
      <h2>Full Stack Engineer</h2>
    </hgroup>
  </header>
)

Header.propTypes = {
  foregroundColor: PropTypes.string.isRequired
}

export default Header;
