
"use client";

// helpdesk/HelpdeskForm.jsx
import React, { useState } from 'react';
import styles from './HelpdeskForm.module.css';
import { createHelpdeskTicket } from './helpdeskService';

const HelpdeskForm = () => {
  const [formData, setFormData] = useState({
    issue: '',
    ticketId: '',
    status: '',
    priority: '',
    createdAt: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHelpdeskTicket(formData);
      alert('Ticket created');
    } catch (error) {
      alert('Error creating ticket');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="issue"
        placeholder="Issue Description"
        value={formData.issue}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ticketId"
        placeholder="Ticket ID"
        value={formData.ticketId}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        required
      >
        <option value="">Select Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        name="createdAt"
        value={formData.createdAt}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default HelpdeskForm;
