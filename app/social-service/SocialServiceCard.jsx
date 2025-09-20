// social-service/SocialServiceCard.jsx
'use client';
import React from 'react';
import styles from './SocialServiceCard.module.css';

const SocialServiceCard = ({ service }) => {
  return (
    <div className={styles.card}>
      <h3>{service.patientName}</h3>
      <p>Service ID: {service.serviceId}</p>
      <p>Type: {service.serviceType}</p>
      <p>Status: {service.status}</p>
      <p>Date: {new Date(service.date).toLocaleDateString()}</p>
    </div>
  );
};

export default SocialServiceCard;
