import { useLoaderData } from "react-router";
import ReadComponent from "../../components/products/readComponent";

function ReadPage() {
	const product: ProductDTO = useLoaderData();
	return (
		<div className="w-full">
			<div>Product Read</div>
			<ReadComponent product={product} />
		</div>
	);
}

export default ReadPage;
