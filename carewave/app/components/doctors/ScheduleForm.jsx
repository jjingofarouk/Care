'use client';
import React from 'react';
import { useState } from 'react';

export default function ScheduleForm({ schedule, doctors, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    doctorId: schedule?.doctorId || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    dayOfWeek: schedule?.dayOfWeek || '',
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
        type="time"
        name="startTime"
        placeholder="Start Time"
        value={formData.startTime}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <input
        type="time"
        name="endTime"
        placeholder="End Time"
        value={formData.endTime}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <select
        name="dayOfWeek"
        value={formData.dayOfWeek}
        onChange={handleChange}
        className="select w-full"
        required
      >
        <option value="" disabled>Select Day of Week</option>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
        >
          {schedule ? 'Update' : 'Create'} Schedule
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