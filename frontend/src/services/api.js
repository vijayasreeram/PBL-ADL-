const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function diagnoseCrop(file, fieldId = 'FIELD-TN-01') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('field_id', fieldId);

  const response = await fetch(`${API_URL}/api/diagnose`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to analyze crop image');
  }

  return response.json();
}

export async function fetchHistory() {
  const response = await fetch(`${API_URL}/api/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch diagnostic history');
  }
  return response.json();
}

export async function fetchWeatherRisk(lat = 0.0, lon = 0.0) {
  const response = await fetch(`${API_URL}/api/weather-risk?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather risk analysis');
  }
  return response.json();
}
