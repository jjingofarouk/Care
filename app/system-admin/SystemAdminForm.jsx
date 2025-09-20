// system-admin/SystemAdminForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './SystemAdminForm.module.css';
import { createSystemAdmin } from './systemAdminService';

const SystemAdminForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    adminId: '',
    role: '',
    email: '',
    lastUpdated: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSystemAdmin(formData);
      alert('System admin created');
    } catch (error) {
      alert('Error creating system admin');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Admin Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="adminId"
        placeholder="Admin ID"
        value={formData.adminId}
        onChange={handleChange}
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="Super Admin">Super Admin</option>
        <option value="Admin">Admin</option>
        <option value="Moderator">Moderator</option>
      </select>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="lastUpdated"
        value={formData.lastUpdated}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SystemAdminForm;
