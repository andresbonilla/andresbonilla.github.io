import React from 'react'
import PropTypes from 'prop-types'

const PendingTransaction = ({ transactionHash, backgroundColor, foregroundColor }) => (
  <a
    className="pending-transaction"
    href={`https://etherscan.io/tx/${transactionHash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      backgroundColor: foregroundColor,
      color: backgroundColor,
    }}
  >
    Pending transaction
  </a>
)

PendingTransaction.propTypes = {
  transactionHash: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired
}

export default PendingTransaction
