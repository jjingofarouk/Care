'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { emergencyService } from '../../../services/emergencyService';

export default function AmbulanceDetailPage() {
  const { id } = useParams();
  const [ambulance, setAmbulance] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    status: '',
  });

  useEffect(() => {
    fetchAmbulance();
  }, [id]);

  const fetchAmbulance = async () => {
    const data = await emergencyService.getAmbulance(id);
    setAmbulance(data);
    setFormData({
      vehicleNumber: data.vehicleNumber,
      status: data.status,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.updateAmbulance(id, formData);
    fetchAmbulance();
  };

  if (!ambulance) return <div className="skeleton h-8 w-full"></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Ambulance Details</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input w-full"
          />
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}