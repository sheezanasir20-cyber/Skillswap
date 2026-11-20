export interface ApiResponse<T = any> {
  data: T;
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
  requestId?: string;
}

class ApiClient {
  private baseUrl = '/api/v1';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = localStorage.getItem('skillswap_token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const json = await response.json();

    if (!response.ok) {
      const error: ApiError = json.error || {
        code: 'HTTP_ERROR',
        message: response.statusText || 'Request failed.',
      };
      throw error;
    }

    return json.data;
  }

  public get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let query = '';
    if (params) {
      const filtered = Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ''
      );
      if (filtered.length > 0) {
        query = `?${new URLSearchParams(filtered as any).toString()}`;
      }
    }
    return this.request<T>(`${endpoint}${query}`, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
