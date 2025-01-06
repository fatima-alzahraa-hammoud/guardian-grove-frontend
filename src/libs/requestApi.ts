import axios, { Method } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://127.0.0.1:8080";

interface RequestApiParams {
    route: string;
    method?: Method;
    body?: any;
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
    } catch (error : any) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred';

            toast.error(errorMessage);
        } else {
            toast.error('An error occurred. Please try again.');
        }

        return {
            devError: error,
            response: error.response?.data,
        };
    }
};