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
  // if (typeof window == 'undefined') {
  //   console.error('typeof window is undefined, running on server side');
  //   const { cookies } = await import('next/headers');
  //   console.error(cookies);
  //   const cookieStore = await cookies();
  //   console.error(cookieStore);
  //   const access_token = cookieStore.get('access_token')?.value;
  //   console.log(access_token);
  //   if (access_token) {
  //     console.log('Access token found in cookies:', access_token);
  //     headers.Authorization = `Bearer ${access_token}`;
  //   } else {
  //     console.error('No access token found in cookies');
  //   }
  // } else{
  //   console.error('typeof window is defined, not running on server side');
  // }
  const config: RequestInit = {
    method,
    headers,
    // credentials: 'include',
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
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  return await response.json();
}
