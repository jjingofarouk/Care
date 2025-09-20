'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalTask } from '@/services/clinicalService';
import { ArrowLeft, User, UserCog, FileText, Calendar, CheckCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ClinicalTaskView({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getClinicalTask(params.id);
        setTask(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical task:', error);
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width={200} height={32} />
          <Skeleton width={120} height={40} />
        </div>
        <div className="card">
          <div className="space-y-6">
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="60%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="40%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="40%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={16} count={2} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="30%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="50%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="50%" height={16} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="alert alert-error animate-fade-in">
        <FileText size={20} />
        <span>Task not found</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Clinical Task</h1>
        <button
          onClick={() => router.push('/clinical/tasks')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Tasks
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Task Details</h2>
          <p className="card-subtitle">Clinical task information</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <User size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Patient</h3>
              <p className="text-hospital-gray-900">{task.patient.firstName} {task.patient.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCog size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Assigned To</h3>
              <p className="text-hospital-gray-900">{task.assignedToId}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCog size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Assigned To Type</h3>
              <p className="text-hospital-gray-900">{task.assignedToType}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Description</h3>
              <p className="text-hospital-gray-900">{task.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Status</h3>
              <p className="text-hospital-gray-900">{task.status}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Created At</h3>
              <p className="text-hospital-gray-900">{new Date(task.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Updated At</h3>
              <p className="text-hospital-gray-900">{new Date(task.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}