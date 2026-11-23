import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/todoApi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken: string, refreshToken: string) => {
	const header = { headers: { Authorization: `Bearer ${accessToken}` } };
	const res = await axios.get(`${API_SERVER_HOST}/api/member/refresh`, {
		...header,
		params: { refreshToken }
	});
	return res.data;
};

const beforeReq = (config: InternalAxiosRequestConfig) => {
	const memberInfo = getCookie("member");
	if (!memberInfo) {
		return Promise.reject(new Error("REQUIRE_LOGIN"));
	}
	config.headers.Authorization = `Bearer ${memberInfo.accessToken}`;
	return config;
};

const requestFail = (err: AxiosError) => {
	return Promise.reject(err);
};

const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {
	const data = res.data;
	if (data && data.error === "ERROR_ACCESS_TOKEN") {
		const memberCookieValue = getCookie("member");
		if (!memberCookieValue) {
			return Promise.reject(new Error("REQUIRE_LOGIN"));
		}
		const result = await refreshJWT(
			memberCookieValue.accessToken,
			memberCookieValue.refreshToken
		);
		memberCookieValue.accessToken = result.accessToken;
		memberCookieValue.refreshToken = result.refreshToken;
		setCookie("member", JSON.stringify(memberCookieValue), 1);
		const originalRequest = res.config;
		originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
		return await axios(originalRequest);
	}
	return res;
};

const responseFail = async (err: AxiosError) => {
	return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
