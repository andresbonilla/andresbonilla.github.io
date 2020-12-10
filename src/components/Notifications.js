import React from 'react'
import PropTypes from 'prop-types';

import Announcement from './Announcement'
import PendingTransaction from './PendingTransaction'

const Notifications = ({
  announcement,
  backgroundColor,
  foregroundColor,
  pendingTransactions
}) => (
  <div className="notifications">
    {Boolean(announcement) && (
      <Announcement
        announcementData={announcement}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      />
    )}
    {pendingTransactions.map((txHash) => (
      <PendingTransaction
        key={txHash}
        transactionHash={txHash}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      />
    ))}
  </div>
)

Notifications.defaultProps = {
  announcement: null
}

Notifications.propTypes = {
  announcement: PropTypes.shape({
    transactionHash: PropTypes.string.isRequired,
    account: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }),
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  pendingTransactions: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Notifications;
