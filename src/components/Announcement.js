import React from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'

const Announcement = ({
  announcementData,
  backgroundColor,
  foregroundColor
}) => (
  <a
    className="announcement"
    href={`https://etherscan.io/tx/${announcementData.transactionHash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      backgroundColor: foregroundColor,
      color: backgroundColor,
    }}
  >
    {`${announcementData.account.slice(0, 10)}... just paid ${Web3.utils.fromWei(announcementData.weiCostString)} ETH to set the background color to ${announcementData.color}`}
  </a>
)

Announcement.propTypes = {
  announcementData: PropTypes.shape({
    transactionHash: PropTypes.string.isRequired,
    account: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired
}

export default Announcement
