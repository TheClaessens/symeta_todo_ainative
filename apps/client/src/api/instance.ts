import Axios from 'axios';

import { env } from '@/env';
import { getToken } from '@/routes/(auth)/lib/token';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: env.VITE_BACKEND_URL,
  paramsSerializer: {
    indexes: null,
  },
});

type CustomAxiosInstance<T> = (data: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number>;
  headers?: Record<string, unknown>;
  data?: BodyType<unknown>;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob';
}) => Promise<T>;

export const useCustomAxiosInstance =
  <T>(): CustomAxiosInstance<T> =>
  async ({ method, params, data, headers, url }) => {
    const token = getToken();

    const response = await AXIOS_INSTANCE.request<T>({
      method,
      url,
      params,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

export default useCustomAxiosInstance;

export type ErrorType<ErrorData> = ErrorData;

export type BodyType<BodyData> = BodyData;
