import React from 'react';
import styles from './AppointmentConfirmation.module.css';

export default function AppointmentConfirmation({ appointment, onClose }) {
  const handleAddToCalendar = () => {
    const event = {
      title: `Appointment with ${appointment.doctor.user.name}`,
      description: `Reason: ${appointment.reason}\nNotes: ${appointment.notes || 'None'}`,
      start: new Date(appointment.date).toISOString(),
      duration: [30, 'minute'],
      location: 'Hospital',
    };
    console.log('Add to calendar:', event);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Appointment Confirmed</h2>
        <p><strong>Patient:</strong> {appointment.patient.user.name}</p>
        <p><strong>Doctor:</strong> {appointment.doctor.user.name}</p>
        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleAddToCalendar}>
            Add to Calendar
          </button>
          <button className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}