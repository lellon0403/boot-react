import axios from "axios";
import { API_SERVER_HOST } from "./todoApi";

export const loginPost = async (email: string, pw: string) => {
	const form = new URLSearchParams();
	form.append("username", email);
	form.append("password", pw);
	const res = await axios.post(`${API_SERVER_HOST}/api/member/login`, form);
	return res.data;
};
