import React from 'react';
import { useState, useEffect } from 'react';
import { getDepartments } from '../../services/departmentService';
import { getSpecializations } from '../../services/doctorService';

export default function DoctorForm({ doctor, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: doctor?.firstName || '',
    lastName: doctor?.lastName || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    departmentId: doctor?.departmentId || '',
    specializationIds: doctor?.specializations?.map(s => s.specializationId) || [],
  });
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptData, specData] = await Promise.all([
          getDepartments(),
          getSpecializations()
        ]);
        setDepartments(deptData || []);
        setSpecializations(specData || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setDepartments([]);
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e) => {
    setFormData(prev => ({ ...prev, specializationIds: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="input w-full"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="input w-full"
      />
      <select
        name="departmentId"
        value={formData.departmentId}
        onChange={handleChange}
        className="select w-full"
        required
      >
        <option value="" disabled>Select Department</option>
        {departments.length > 0 ? (
          departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))
        ) : (
          <option disabled>No departments available</option>
        )}
      </select>
      <select
        multiple
        value={formData.specializationIds}
        onChange={handleSpecializationChange}
        className="select w-full"
      >
        {specializations.length > 0 ? (
          specializations.map(spec => (
            <option key={spec.id} value={spec.id}>{spec.name}</option>
          ))
        ) : (
          <option disabled>No specializations available</option>
        )}
      </select>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.departmentId}
        >
          {doctor ? 'Update' : 'Create'} Doctor
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