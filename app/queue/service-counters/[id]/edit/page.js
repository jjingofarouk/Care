'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import queueService from '@/services/queueService';

export default function EditServiceCounterPage() {
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    Promise.all([
      queueService.getServiceCounterById(params.id),
      queueService.getDepartments(),
    ]).then(([serviceCounter, departments]) => {
      setFormData({
        name: serviceCounter.name,
        departmentId: serviceCounter.departmentId,
      });
      setDepartments(departments);
    });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await queueService.updateServiceCounter(params.id, formData);
    router.push(`/queue/service-counters/${params.id}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <h1 className="text-2xl font-bold text-hospital-gray-900 mb-4">Edit Service Counter</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Department</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push(`/queue/service-counters/${params.id}`)}
            className="bg-hospital-gray-400 text-hospital-white px-4 py-2 rounded-md mr-2 hover:bg-hospital-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-accent-dark"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
