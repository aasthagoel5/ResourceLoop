import axios from "axios";

const api = axios.create({
  baseURL : "http://localhost:5000/api",
});

//Automatically attach the access token to every request , if we have one
api.interceptors.request.use((config) =>{
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = ` Bearer ${token} `; 
  }
  return config;
});

export default api;