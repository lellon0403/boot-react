import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./todoApi";

const host = `${API_SERVER_HOST}/api/products`;

export const getList = async (pageParam: PageParam) => {
	const res = await jwtAxios.get(`${host}/list`, { params: pageParam });
	return res.data;
};
