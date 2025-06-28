import axios, { Method, AxiosError } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.BACKEND_API_URL || "http://127.0.0.1:8000";
console.log("API Base URL:", axios.defaults.baseURL);
console.log("Environment:", import.meta.env.BACKEND_API_URL);
interface RequestApiParams {
    route: string;
    method?: Method;
    body?: unknown;
}

export const requestApi = async ({ route, method = "GET", body }: RequestApiParams) => {
    try {
        const response = await axios.request({
            url: route,
            method,
            data: body,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        });

        return response.data;
    } catch (error: unknown) { // Replace any with unknown
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error?: string; message?: string }>;
            const errorMessage = axiosError.response?.data?.error || 
                                axiosError.response?.data?.message || 
                                'An unexpected error occurred';

            toast.error(errorMessage);
        } else {
            toast.error('An error occurred. Please try again.');
        }

        return {
            devError: error,
            response: (error as AxiosError)?.response?.data,
        };
    }
};