'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLabResult, getLabRequests } from '@/services/laboratoryService';
import { Save, X, ChevronDown, ChevronUp, Search, Calendar, User, TestTube, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function LabResultNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    labRequestId: '',
    result: '',
    resultedAt: new Date().toISOString().slice(0, 16), // Default to current datetime
  });
  
  const [labRequests, setLabRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch lab requests on component mount
  useEffect(() => {
    fetchLabRequests();
  }, []);

  const fetchLabRequests = async () => {
    try {
      setLoading(true);
      const requests = await getLabRequests();
      // Filter out requests that already have results
      const pendingRequests = requests.filter(request => 
        !request.labResults || request.labResults.length === 0
      );
      setLabRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching lab requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.labRequestId || !formData.result || !formData.resultedAt) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await createLabResult(formData);
      router.push('/laboratory/results');
    } catch (error) {
      console.error('Error creating lab result:', error);
      alert('Failed to create lab result. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestSelect = (request) => {
    setFormData({
      ...formData,
      labRequestId: request.id
    });
    setSelectedRequest(request);
    setShowRequests(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = labRequests.filter(request =>
    request.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.labTest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRequests = filteredRequests.slice(0, displayCount);

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Result</h1>
      
      {/* Recent Lab Requests Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-[var(--hospital-blue-600)]" />
            <h2 className="text-lg font-semibold text-[var(--hospital-gray-900)]">
              Recent Lab Requests
            </h2>
            <span className="bg-[var(--hospital-blue-100)] text-[var(--hospital-blue-700)] px-2 py-1 rounded-full text-sm">
              {labRequests.length} pending
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRequests(!showRequests)}
            className="flex items-center gap-2 text-[var(--hospital-blue-600)] hover:text-[var(--hospital-blue-700)] transition-colors"
          >
            {showRequests ? (
              <>
                <span>Hide</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>View Recent</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {showRequests && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--hospital-gray-400)]" />
              <input
                type="text"
                placeholder="Search by patient name, test name, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>

            {/* Requests List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--hospital-blue-600)] mx-auto"></div>
                <p className="text-[var(--hospital-gray-600)] mt-2">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-[var(--hospital-gray-400)] mx-auto mb-2" />
                <p className="text-[var(--hospital-gray-600)]">
                  {searchTerm ? 'No requests found matching your search.' : 'No pending lab requests found.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-3">
                  {displayedRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                        selectedRequest?.id === request.id
                          ? 'border-[var(--hospital-blue-500)] bg-[var(--hospital-blue-50)]'
                          : 'border-[var(--hospital-gray-200)] hover:border-[var(--hospital-blue-300)]'
                      }`}
                      onClick={() => handleRequestSelect(request)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                          <div>
                            <p className="font-medium text-[var(--hospital-gray-900)]">
                              {request.patient.firstName} {request.patient.lastName}
                            </p>
                            <p className="text-xs text-[var(--hospital-gray-500)]">
                              ID: {request.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TestTube className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                          <div>
                            <p className="font-medium text-[var(--hospital-gray-900)]">
                              {request.labTest.name}
                            </p>
                            {request.sample && (
                              <p className="text-xs text-[var(--hospital-gray-500)]">
                                Sample: {request.sample.sampleType}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                          <div>
                            <p className="text-sm text-[var(--hospital-gray-700)]">
                              {formatDate(request.requestedAt)}
                            </p>
                            <p className="text-xs text-[var(--hospital-gray-500)]">
                              Requested
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[var(--hospital-yellow-500)]" />
                          <span className="text-sm bg-[var(--hospital-yellow-100)] text-[var(--hospital-yellow-700)] px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {filteredRequests.length > displayCount && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setDisplayCount(displayCount + 10)}
                      className="text-[var(--hospital-blue-600)] hover:text-[var(--hospital-blue-700)] font-medium"
                    >
                      Show {Math.min(10, filteredRequests.length - displayCount)} more requests
                    </button>
                  </div>
                )}

                {displayCount >= filteredRequests.length && filteredRequests.length > 5 && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setDisplayCount(5)}
                      className="text-[var(--hospital-gray-600)] hover:text-[var(--hospital-gray-700)] font-medium"
                    >
                      Show less
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Selected Request Info */}
      {selectedRequest && (
        <div className="card mb-6 border-[var(--hospital-green-200)] bg-[var(--hospital-green-50)]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-[var(--hospital-green-600)]" />
            <h3 className="font-semibold text-[var(--hospital-green-800)]">Selected Request</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[var(--hospital-gray-600)]">Patient</p>
              <p className="font-medium text-[var(--hospital-gray-900)]">
                {selectedRequest.patient.firstName} {selectedRequest.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--hospital-gray-600)]">Test</p>
              <p className="font-medium text-[var(--hospital-gray-900)]">
                {selectedRequest.labTest.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--hospital-gray-600)]">Request ID</p>
              <p className="font-medium text-[var(--hospital-gray-900)]">
                {selectedRequest.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--hospital-gray-600)]">Requested</p>
              <p className="font-medium text-[var(--hospital-gray-900)]">
                {formatDate(selectedRequest.requestedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
              Lab Request ID *
            </label>
            <input
              type="text"
              value={formData.labRequestId}
              onChange={(e) => setFormData({ ...formData, labRequestId: e.target.value })}
              placeholder="Enter or select a lab request ID"
              className="input w-full"
              required
            />
            <p className="text-xs text-[var(--hospital-gray-500)] mt-1">
              You can select a request from the list above or enter the ID manually
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
              Result *
            </label>
            <textarea
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              placeholder="Enter the lab test result details..."
              className="textarea w-full"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
              Result Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.resultedAt}
              onChange={(e) => setFormData({ ...formData, resultedAt: e.target.value })}
              className="input w-full"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Result
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/results')}
              disabled={submitting}
              className="btn btn-secondary flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}