// system-admin/SystemAdminList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './SystemAdminList.module.css';
import { getSystemAdmins } from './systemAdminService';
import SystemAdminCard from './SystemAdminCard';

const SystemAdminList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getSystemAdmins();
        setAdmins(data);
      } catch (error) {
        console.error('Error fetching system admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className={styles.list}>
      {admins.map((admin) => (
        <SystemAdminCard key={admin.id} admin={admin} />
      ))}
    </div>
  );
};

export default SystemAdminList;
