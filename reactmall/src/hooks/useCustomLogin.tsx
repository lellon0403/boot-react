import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, createSearchParams, useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../store";
import { loginPostAsync, logout, save } from "../slices/loginSlice";
import { getCookie } from "../util/cookieUtil";

const useCustomLogin = () => {
	const dispatch = useDispatch<AppDispatch>();
	const loginState = useSelector((state: RootState) => state.loginSlice);
	const loginStatus = loginState.status;
	const navigate = useNavigate();

	useEffect(() => {
		if (!loginStatus) {
			const member = getCookie("member");
			if (member) {
				dispatch(save(member));
			}
		}
	}, []);

	const doLogin = async (email: string, pw: string) => {
		dispatch(loginPostAsync({ email, pw }));
	};

	const doLogout = () => {
		dispatch(logout());
	};

	const moveToLogin = () => {
		navigate("/member/login");
	};

	const moveToLoginReturn = () => {
		return <Navigate replace to="/member/login" />;
	};

	const moveToPath = (path: string) => {
		navigate({ pathname: path }, { replace: true });
	};

	const exceptionHandle = (ex: any) => {
		const errorMsg = ex?.response?.data?.error ?? ex?.message;
		const errorStr = createSearchParams({ error: errorMsg }).toString();

		if (errorMsg === "REQUIRE_LOGIN") {
			alert("로그인 해야만 합니다.");
			navigate({ pathname: "/member/login", search: errorStr });
			return;
		}

		if (errorMsg === "ERROR_ACCESSDENIED") {
			alert("해당 메뉴를 사용할수 있는 권한이 없습니다.");
			navigate({ pathname: "/member/login", search: errorStr });
			return;
		}
	};

	return {
		loginState,
		loginStatus,
		doLogin,
		doLogout,
		moveToLogin,
		moveToLoginReturn,
		moveToPath,
		exceptionHandle
	};
};

export default useCustomLogin;
