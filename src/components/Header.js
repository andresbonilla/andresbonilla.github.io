import React from 'react'
import PropTypes from 'prop-types';

const Header = ({ foregroundColor }) => (
  <header style={{ borderBottom: `4px solid ${foregroundColor}`}}>
    <hgroup>
      <h1>Andrés Bonilla</h1>
      <h2>Senior Software Engineer at Raincoat</h2>
    </hgroup>
  </header>
)

Header.propTypes = {
  foregroundColor: PropTypes.string.isRequired
}

export default Header;
