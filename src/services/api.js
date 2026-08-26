import { API_BASE_URL } from '../config/env';

async function getErrorMessage(response, defaultMessage) {
  try {
    const data = await response.json();
    return data?.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

export async function apiRequest(path, options = {}, defaultMessage = 'Ocurrio un error en la solicitud') {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, defaultMessage));
  }

  return response.json();
}
