import { useLoaderData } from "react-router";
import ListComponent from "../../components/products/listComponent";

const ListPage = () => {
	const pageResponse = useLoaderData<PageResponseDTO<ProductDTO>>();
	return (
		<div className="w-full mt-4 border border-solid border-neutral-300 shadow-md">
			<div className="text-2xl m-4 font-extrabold">Products List Page</div>
			<ListComponent serverData={pageResponse} />
		</div>
	);
};

export default ListPage;
