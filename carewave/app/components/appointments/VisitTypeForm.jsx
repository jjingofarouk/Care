'use client';
import React, { useState } from 'react';
import { X, Check, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VisitTypeForm({ visitType, onSubmit, onCancel }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: visitType?.name || '',
    description: visitType?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = visitType?.id ? 'PUT' : 'POST';
      const url = visitType?.id ? `/api/appointments?resource=visitType&id=${visitType.id}` : '/api/appointments';
      const body = visitType?.id ? formData : { ...formData, resource: 'visitType' };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to save visit type');
      onSubmit();
      onCancel();
      router.push('/appointments/visit-types');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-full p-2 mb-2">
      <h2 className="card-title">
        {visitType?.id ? 'Edit Visit Type' : 'New Visit Type'}
      </h2>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <FileText className="absolute left-3 top-3.5 w-4 h-4 text-[var(--hospital-gray-500)]" />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="textarea w-full"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner mr-2"></div>
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {visitType?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}