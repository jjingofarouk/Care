'use client';

import React, { useState, useEffect } from 'react';
import { getUsers } from '@/services/operationTheatreService';

const SurgicalTeamForm = ({ onClose, onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    members: initialData.members || [{ userId: '', role: '' }],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const newMembers = [...formData.members];
      newMembers[index][e.target.name] = e.target.value;
      setFormData({ ...formData, members: newMembers });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addMember = () => {
    setFormData({ ...formData, members: [...formData.members, { userId: '', role: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/surgeries?type=surgicalTeam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save surgical team');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="card w-full max-w-lg">
        <div className="card-header">
          <h2 className="card-title">{initialData.id ? 'Edit Surgical Team' : 'Create Surgical Team'}</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="loading-spinner" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            {formData.members.map((member, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-hospital-gray-700 mb-1">User</label>
                  <select
                    name="userId"
                    value={member.userId}
                    onChange={(e) => handleChange(e, index)}
                    className="select w-full"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={member.role}
                    onChange={(e) => handleChange(e, index)}
                    className="select w-full"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="SURGEON">Surgeon</option>
                    <option value="ASSISTANT">Assistant</option>
                    <option value="ANESTHESIOLOGIST">Anesthesiologist</option>
                    <option value="SCRUB_NURSE">Scrub Nurse</option>
                    <option value="CIRCULATING_NURSE">Circulating Nurse</option>
                    <option value="TECHNICIAN">Technician</option>
                  </select>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline w-full" onClick={addMember}>
              Add Team Member
            </button>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurgicalTeamForm;