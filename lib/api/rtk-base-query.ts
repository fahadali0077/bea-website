import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig, Method } from "axios";

import { apiClient, getApiErrorMessage } from "./axios-client";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: Method;
  data?: unknown;
  params?: unknown;
}

export interface AxiosBaseQueryError {
  status?: number;
  message: string;
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const config: AxiosRequestConfig = { url, method, data, params };
      const result = await apiClient.request(config);
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          message: getApiErrorMessage(error),
        },
      };
    }
  };
