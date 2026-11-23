import jwtAxios from "../util/jwtUtil";
import type { LoaderFunctionArgs } from "react-router";

export async function loadProduct({ params, request }: LoaderFunctionArgs) {
	const res = await jwtAxios.get<ProductDTO>(`http://localhost:8080/api/products/${params.pno}`, {
		signal: request.signal
	});
	return res.data;
}
