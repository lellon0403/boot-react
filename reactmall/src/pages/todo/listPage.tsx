import { useSearchParams } from "react-router";

function ListPage() {
    const [queryParams] = useSearchParams()
    const page: string = queryParams.get("page") || "1"
    const size: string = queryParams.get("size") || "10"

    return (
        <div className="bg-white w-full p-4 text-3xl font-bold">
            <div>Todo List Page</div>
            <div>Component {page} --- {size}</div>
        </div>
    );
}
export default ListPage;
