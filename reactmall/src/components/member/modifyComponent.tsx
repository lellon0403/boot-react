import { useActionState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import jwtAxios from "../../util/jwtUtil";
import { API_SERVER_HOST } from "../../api/todoApi";
import PendingModal from "../common/pendingModal";
import ResultModal from "../common/resultModal";

interface ModifyResult {
	result: string;
	error: string;
}

const initState: ModifyResult = {
	result: "",
	error: ""
};

const modifyAction = async (_state: ModifyResult, formData: FormData): Promise<ModifyResult> => {
	const email = formData.get("email") as string;
	const pw = formData.get("pw") as string;
	const nickname = formData.get("nickname") as string;

	if (pw.length < 8) {
		return { result: "", error: "패스워드는 8자 이상이어야 합니다." };
	}

	try {
		await jwtAxios.put(`${API_SERVER_HOST}/api/member/modify`, { email, pw, nickname });
	} catch (err: any) {
		return { result: "", error: err.response?.data?.error || "수정 중 오류가 발생했습니다." };
	}

	return { result: "Modified", error: "" };
};

function ModifyComponent() {
	const { loginState, moveToLogin } = useCustomLogin();
	const [state, action, isPending] = useActionState(modifyAction, initState);

	const closeModal = () => {
		moveToLogin();
	};

	return (
		<div className="mt-6">
			{isPending && <PendingModal />}

			{state.error && <div className="bg-amber-500">{state.error}</div>}

			{state.result && (
				<ResultModal title="회원정보" content="정보수정완료" callbackFn={closeModal} />
			)}

			<form action={action}>
				<div className="flex justify-center">
					<div className="relative mb-4 flex w-full flex-wrap items-stretch">
						<div className="w-1/5 p-6 text-right font-bold">Email</div>
						<input
							className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
							name="email"
							type="text"
							defaultValue={loginState.email}
							readOnly
						/>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="relative mb-4 flex w-full flex-wrap items-stretch">
						<div className="w-1/5 p-6 text-right font-bold">Password</div>
						<input
							className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
							name="pw"
							type="password"
						/>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="relative mb-4 flex w-full flex-wrap items-stretch">
						<div className="w-1/5 p-6 text-right font-bold">Nickname</div>
						<input
							className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
							name="nickname"
							type="text"
							defaultValue={loginState.nickname}
						/>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="relative mb-4 flex w-full flex-wrap justify-end">
						<button type="submit" className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500">
							Modify
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default ModifyComponent;
