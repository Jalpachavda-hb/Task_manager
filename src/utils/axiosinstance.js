import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosinstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosinstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosinstance.interceptors.response.use(
    (response) =>{
        return response;
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 401){
                window.location.href ="/login";

            }
            else if(error.response.status === 500){
                console.error("internal server error.Please try Again later.")
            }
        }
        else if(error.code === "ECONNABORTED"){
            console.error("request timeout. please try again later.");
        }
        return Promise.reject(error);
    }
);
export default axiosinstance;