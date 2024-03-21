import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_URL } from "@/config";

export const axios = Axios.create({ baseURL: API_URL });

export const authAxios = Axios.create({ baseURL: API_URL });

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
}

//axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
