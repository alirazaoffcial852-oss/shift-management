import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken } from "./getToken";

const isProduction = typeof window !== "undefined" && window.location.protocol === "https:";
const baseURL = isProduction 
  ? "/api/proxy"  
  : process.env.NEXT_PUBLIC_API_BASE_URL;
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
  payload?: any,
  params?: Record<string, any>
) => {
  try {
    const isFormData = payload instanceof FormData;
    const config: AxiosRequestConfig = {
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    };

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
const patch = async (url: string, payload: any) =>
  request("patch", url, payload);
const del = async (url: string) => request("delete", url);
const JsonHttp = {
  get,
  post,
  put,
  patch,
  del,
};
export default JsonHttp;
