import axios, { Method, AxiosError } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL =  "http://127.0.0.1:8000";
console.log("API Base URL:", axios.defaults.baseURL);
console.log("Environment:", import.meta.env.VITE_API_URL);
interface RequestApiParams {
    route: string;
    method?: Method;
    body?: unknown;
}

export const requestApi = async ({ route, method = "GET", body }: RequestApiParams) => {
    try {
        // Prepare headers
        const headers: Record<string, string> = {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        };

        // Only set Content-Type for non-FormData requests
        if (body && !(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        const response = await axios.request({
            url: route,
            method,
            data: body,
            headers
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