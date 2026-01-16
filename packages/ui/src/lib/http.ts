import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken } from "./getToken";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.replace("/sign-in");
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
);
const request = async (
  method: string,
  url: string,
  payload?: Record<string, any>,
  params?: Record<string, any>
) => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
    };

    config.headers = {
      "Content-Type": "multipart/form-data",
    };

    config.data = payload;

    if (params) {
      config.params = params;
    }

    const response: AxiosResponse = await instance(config);

    return response.data;
  } catch (err: any) {
    throw err?.response;
  }
};
const get = async (url: string, params?: Record<string, any>) =>
  request("get", url, undefined, params);
const post = async (url: string, payload: any) => request("post", url, payload);
const put = async (url: string, payload: any) => request("put", url, payload);
const patch = async (url: string, payload?: any) =>
  request("patch", url, payload);
const del = async (url: string) => request("delete", url);
const http = {
  get,
  post,
  put,
  patch,
  del,
};
export default http;
