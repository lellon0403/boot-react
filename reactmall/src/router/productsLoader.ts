import jwtAxios from "../util/jwtUtil";
import { createSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loadProducts({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const page = url.searchParams.get("page") || "1";
	const size = url.searchParams.get("size") || "10";
	const queryStr = createSearchParams({ page, size }).toString();
	const res = await jwtAxios.get<PageResponseDTO<ProductDTO>>(
		`http://localhost:8080/api/products/list?${queryStr}`,
		{ signal: request.signal }
	);
	return res.data;
}

export async function loadProduct({ params, request }: LoaderFunctionArgs) {
	const res = await jwtAxios.get<ProductDTO>(`http://localhost:8080/api/products/${params.pno}`, {
		signal: request.signal
	});
	return res.data;
}
