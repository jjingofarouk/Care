export async function getLabTests() {
  const response = await fetch('/api/laboratory/tests');
  if (!response.ok) throw new Error('Failed to fetch lab tests');
  return response.json();
}

export async function getLabTest(id) {
  const response = await fetch(`/api/laboratory/tests/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lab test');
  return response.json();
}

export async function createLabTest(data) {
  const response = await fetch('/api/laboratory/tests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create lab test');
  return response.json();
}

export async function updateLabTest(id, data) {
  const response = await fetch(`/api/laboratory/tests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lab test');
  return response.json();
}

export async function deleteLabTest(id) {
  const response = await fetch(`/api/laboratory/tests/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete lab test');
  return response.json();
}

export async function getLabRequests() {
  const response = await fetch('/api/laboratory/requests');
  if (!response.ok) throw new Error('Failed to fetch lab requests');
  return response.json();
}

export async function getLabRequest(id) {
  const response = await fetch(`/api/laboratory/requests/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lab request');
  return response.json();
}

export async function createLabRequest(data) {
  const response = await fetch('/api/laboratory/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create lab request');
  return response.json();
}

export async function updateLabRequest(id, data) {
  const response = await fetch(`/api/laboratory/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lab request');
  return response.json();
}

export async function deleteLabRequest(id) {
  const response = await fetch(`/api/laboratory/requests/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete lab request');
  return response.json();
}

export async function getLabResults() {
  const response = await fetch('/api/laboratory/results');
  if (!response.ok) throw new Error('Failed to fetch lab results');
  return response.json();
}

export async function getLabResult(id) {
  const response = await fetch(`/api/laboratory/results/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lab result');
  return response.json();
}

export async function createLabResult(data) {
  const response = await fetch('/api/laboratory/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create lab result');
  return response.json();
}

export async function updateLabResult(id, data) {
  const response = await fetch(`/api/laboratory/results/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lab result');
  return response.json();
}

export async function deleteLabResult(id) {
  const response = await fetch(`/api/laboratory/results/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete lab result');
  return response.json();
}

export async function getSamples() {
  const response = await fetch('/api/laboratory/samples');
  if (!response.ok) throw new Error('Failed to fetch samples');
  return response.json();
}

export async function getSample(id) {
  const response = await fetch(`/api/laboratory/samples/${id}`);
  if (!response.ok) throw new Error('Failed to fetch sample');
  return response.json();
}

export async function createSample(data) {
  const response = await fetch('/api/laboratory/samples', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create sample');
  return response.json();
}

export async function updateSample(id, data) {
  const response = await fetch(`/api/laboratory/samples/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update sample');
  return response.json();
}

export async function deleteSample(id) {
  const response = await fetch(`/api/laboratory/samples/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete sample');
  return response.json();
}
