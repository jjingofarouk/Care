// social-service/SocialServiceList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './SocialServiceList.module.css';
import { getSocialServices } from './socialServiceService';
import SocialServiceCard from './SocialServiceCard';

const SocialServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getSocialServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching social services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className={styles.list}>
      {services.map((service) => (
        <SocialServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default SocialServiceList;
