import axios, { Method } from "axios";

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
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });

        return response.data;
    } catch (error) {
        console.log("======== Error =========");
        console.log(error);
        console.log("======== // =========");

        return {
            devError: error,
        };
    }
};