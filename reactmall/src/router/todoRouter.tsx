import { Navigate } from "react-router";
import IndexPage from "../pages/todo/indexPage";
import { lazy, Suspense } from "react";

const Loading = () => <div>Loading.........</div>

const TodoList = lazy(() => import("../pages/todo/listPage"))
const TodoRead = lazy(() => import("../pages/todo/readPage"))
const TodoAdd = lazy(() => import("../pages/todo/addPage"))

export default function todoRouter() {
    return {
        path: "/todo",
        Component: IndexPage,
        children: [
            {
                index: true,
                element: <Navigate replace to="list"/>
            },
            {
                path: "list",
                element: <Suspense fallback={<Loading/>}><TodoList/></Suspense>
            },
            {
                path: "read/:tno",
                element: <Suspense fallback={<Loading/>}><TodoRead/></Suspense>
            },
            {
                path: "add",
                element: <Suspense fallback={<Loading/>}><TodoAdd/></Suspense>
            }
        ]
    }
}
