
"use client";

// helpdesk/HelpdeskList.jsx
import React, { useEffect, useState } from 'react';
import styles from './HelpdeskList.module.css';
import { getHelpdeskTickets } from './helpdeskService';
import HelpdeskCard from './HelpdeskCard';

const HelpdeskList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getHelpdeskTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className={styles.list}>
      {tickets.map((ticket) => (
        <HelpdeskCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default HelpdeskList;
