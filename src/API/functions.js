import axios from "axios";
import queryString from "query-string";

// const testAPI = "http://192.168.3.251:9001/api";
// const realAPI = "https://isalewebapi.viettassaigon.vn/api";

const axiosClient = axios.create({
  baseURL: "https://isalewebapi.viettassaigon.vn/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringiFy(params),
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response) {
      return response;
    }
    return response;
  },
  (err) => {
    throw err;
  }
);
export { axiosClient };
