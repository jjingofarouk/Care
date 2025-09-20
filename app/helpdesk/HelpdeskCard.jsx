// helpdesk/HelpdeskCard.jsx
import React from 'react';
import styles from './HelpdeskCard.module.css';

const HelpdeskCard = ({ ticket }) => {
  return (
    <div className={styles.card}>
      <h3>{ticket.issue}</h3>
      <p>Ticket ID: {ticket.ticketId}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default HelpdeskCard;
