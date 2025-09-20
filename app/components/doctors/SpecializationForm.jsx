'use client';
import React from 'react';
import { useState } from 'react';

export default function SpecializationForm({ specialization, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: specialization?.name || '',
    description: specialization?.description || '',
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
      <input
        type="text"
        name="name"
        placeholder="Specialization Name"
        value={formData.name}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="textarea w-full"
        rows={4}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
        >
          {specialization ? 'Update' : 'Create'} Specialization
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