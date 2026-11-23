import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import { loadProducts, loadProduct } from "./productsLoader";

const ProductsIndex = lazy(() => import("../pages/products/indexPage"));
const ProductsList = lazy(() => import("../pages/products/listPage"));
const ProductsAdd = lazy(() => import("../pages/products/addPage"));
const ProductRead = lazy(() => import("../pages/products/readPage"));
const ProductsModify = lazy(() => import("../pages/products/modifyPage"));

const Loading = () => <div>Products Loading....</div>;

export default function productsRouter() {
	return {
		path: "products",
		Component: ProductsIndex,
		children: [
			{
				path: "list",
				element: (
					<Suspense fallback={<Loading />}>
						<ProductsList />
					</Suspense>
				),
				loader: loadProducts,
				HydrateFallback: () => <div>로딩 중...</div>
			},
			{
				path: "add",
				element: (
					<Suspense fallback={<Loading />}>
						<ProductsAdd />
					</Suspense>
				)
			},
			{
				path: "",
				element: <Navigate to={"/products/list"}></Navigate>
			},
			{
				path: "read/:pno",
				element: (
					<Suspense fallback={<Loading />}>
						<ProductRead />
					</Suspense>
				),
				loader: loadProduct
			},
			{
				path: "modify/:pno",
				element: (
					<Suspense fallback={<Loading />}>
						<ProductsModify />
					</Suspense>
				),
				loader: loadProduct
			}
		]
	};
}
