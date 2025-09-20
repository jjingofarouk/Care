
// NotificationBanner.jsx
import React, { useState, useEffect } from 'react';
import styles from './NotificationBanner.module.css';
import { getAppointments } from './appointmentService';

export default function NotificationBanner() {
  const [upcoming, setUpcoming] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await getAppointments();
        const now = new Date();
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const upcomingAppointments = data.filter(
          (appt) =>
            appt.status === 'SCHEDULED' &&
            new Date(appt.date) > now &&
            new Date(appt.date) <= next24Hours
        );
        setUpcoming(upcomingAppointments);
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };
    fetchUpcoming();
  }, []);

  if (!upcoming.length && !error) return null;

  return (
    <div className={styles.banner}>
      {error && <p className={styles.error}>{error}</p>}
      {upcoming.map((appt) => (
        <p key={appt.id}>
          Upcoming: {appt.patient.name} with {appt.doctor.name} at{' '}
          {new Date(appt.date).toLocaleString()}
        </p>
      ))}
    </div>
  );
}
