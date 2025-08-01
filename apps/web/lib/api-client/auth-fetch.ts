export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function authFetch(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  data: Record<string, any> = {},
) {
  const access_token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: access_token ? `Bearer ${access_token}` : '',
  };
  const config: RequestInit = {
    method,
    headers,
  };
  let url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  if (method === 'GET' || method === 'DELETE') {
    const queryString = new URLSearchParams(data).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  } else if (method === 'POST' || method === 'PATCH') {
    config.body = JSON.stringify(data);
  }
  const response = await fetch(url, config);
  if (response.status === 401) {
    throw new UnauthorizedError(
      'Unauthorized access. Session might be expired.',
    );
  }
  if (!response.ok) {
    let errorMessage = `Failed to fetch data: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : errorBody.message;
      }
    } catch (e) {
      // ignore parse error and keep default error message
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}
