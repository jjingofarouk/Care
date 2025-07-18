// app/radiology/scan-images/[id]/edit/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getScanImage, updateScanImage, getRadiologyResults } from '@/services/radiologyService';
import { ArrowLeft } from 'lucide-react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function ScanImageEditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({ radiologyResultId: '', imageUrl: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [scanImage, resultData] = await Promise.all([
          getScanImage(params.id),
          getRadiologyResults(),
        ]);
        setFormData({
          radiologyResultId: scanImage.radiologyResultId,
          imageUrl: scanImage.imageUrl,
        });
        setResults(resultData.results);
      } catch (err) {
        setError('Failed to load scan image');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateScanImage(params.id, formData);
      router.push(`/radiology/scan-images/${params.id}`);
    } catch (err) {
      setError('Failed to update scan image');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Edit Scan Image</h1>
        <Button
          variant="outlined"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm"
          onClick={() => router.push('/radiology/scan-images')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scan Images
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <FormControl fullWidth>
            <InputLabel className="block text-sm font-medium text-[var(--hospital-gray-700)]">Result</InputLabel>
            <Select
              value={formData.radiologyResultId}
              onChange={(e) => setFormData({ ...formData, radiologyResultId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent transition-all duration-200"
            >
              <MenuItem value="" disabled>Select a result</MenuItem>
              {results.map((result) => (
                <MenuItem key={result.id} value={result.id}>
                  {result.imagingOrder.patient.firstName} {result.imagingOrder.patient.lastName} - {result.imagingOrder.radiologyTest.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <InputLabel className="block text-sm font-medium text-[var(--hospital-gray-700)]">Image URL</InputLabel>
          <TextField
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
            fullWidth
            className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          />
        </div>
        <Button
          type="submit"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--hospital-accent)] text-white hover:bg-[var(--hospital-accent-dark)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm btn-primary"
        >
          Update Scan Image
        </Button>
      </form>
    </div>
  );
}
