'use client';
import React from 'react';
import { useState } from 'react';

export default function LeaveForm({ leave, doctors, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    doctorId: leave?.doctorId || '',
    startDate: leave?.startDate?.split('T')[0] || '',
    endDate: leave?.endDate?.split('T')[0] || '',
    reason: leave?.reason || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <select
        name="doctorId"
        value={formData.doctorId}
        onChange={handleChange}
        className="select w-full"
        required
      >
        <option value="" disabled>Select Doctor</option>
        {doctors.map(doctor => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.firstName} {doctor.lastName}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="startDate"
        placeholder="Start Date"
        value={formData.startDate}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <input
        type="date"
        name="endDate"
        placeholder="End Date"
        value={formData.endDate}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <textarea
        name="reason"
        placeholder="Reason"
        value={formData.reason}
        onChange={handleChange}
        className="textarea w-full"
        rows={4}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
        >
          {leave ? 'Update' : 'Create'} Leave
        </button>
        <button
          type="button"
          className="btn btn-outline w-full sm:w-auto"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}