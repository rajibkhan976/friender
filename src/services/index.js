import axios from "axios";

const axiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      // Modify headers, add tokens, etc. as needed
      const token = (localStorage.getItem("fr_token") == null)?"":localStorage.getItem("fr_token");
      config.headers.Authorization = token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );



const apiClient = async (method, url, data = {}, params = {})=> {
  // console.log(method, url, data, params);
    try {
        const response = await axiosInstance({
          method: method,
          url: url,
          data: method.toLowerCase() === 'post' ? data : {},
          params: method.toLowerCase() === 'get' ? params : {},
        });
        // console.log('response', response);
        return response.data;
      } catch (error) {
        console.error(`${method.toUpperCase()} request error:`, error);
        // Customize the error message or handling here if needed
        throw error;
      }
};

export default apiClient;
