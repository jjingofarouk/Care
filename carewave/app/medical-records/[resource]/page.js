'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import medicalRecordsService from '../../../services/medicalRecordsService';
import ResourceList from '../../../components/medical-records/ResourceList';
import MedicalRecordFilter from '../../../components/medical-records/MedicalRecordFilter';

export default function ResourcePage() {
  const { resource } = useParams();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ patientId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [resource, filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const method = `get${resource.charAt(0).toUpperCase() + resource.slice(1)}s`;
      const data = await medicalRecordsService[method](filters.patientId);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const method = `delete${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      await medicalRecordsService[method](id);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{resource.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <MedicalRecordFilter onFilterChange={setFilters} showDateRange={false} />
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ResourceList 
          resource={resource}
          items={items}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}