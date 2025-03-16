import { useState } from 'react';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface ApiMethods<T> {
  get: (url: string) => Promise<ApiResponse<T>>;
  post: <D>(url: string, data: D) => Promise<ApiResponse<T>>;
  put: <D>(url: string, data: D) => Promise<ApiResponse<T>>;
  delete: (url: string) => Promise<ApiResponse<T>>;
}

export function useApi<T>(): ApiMethods<T> {
  const [loading, setLoading] = useState(false);

  // Fonction générique pour les requêtes API
  const fetchApi = async <D>(
    url: string,
    method: string,
    data?: D
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          data: null,
          error: responseData.error || 'Une erreur est survenue',
          loading: false,
        };
      }
      
      return {
        data: responseData,
        error: null,
        loading: false,
      };
    } catch (error) {
      console.error('Erreur API:', error);
      return {
        data: null,
        error: 'Une erreur est survenue lors de la communication avec le serveur',
        loading: false,
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Méthodes HTTP
  const get = (url: string) => fetchApi<void>(url, 'GET');
  const post = <D>(url: string, data: D) => fetchApi<D>(url, 'POST', data);
  const put = <D>(url: string, data: D) => fetchApi<D>(url, 'PUT', data);
  const del = (url: string) => fetchApi<void>(url, 'DELETE');
  
  return {
    get,
    post,
    put,
    delete: del,
  };
} 