import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { removeCookie, setCookie } from "../util/cookieUtil";

export interface LoginInfo {
	email: string;
	nickname: string;
	accessToken: string;
	refreshToken: string;
	roleNames: string[];
	status: string;
}

const initState: LoginInfo = {
	email: "",
	nickname: "",
	accessToken: "",
	refreshToken: "",
	roleNames: [],
	status: ""
};

export const loginPostAsync = createAsyncThunk(
	"loginPostAsync",
	({ email, pw }: { email: string; pw: string }) => {
		return loginPost(email, pw);
	}
);

const loginSlice = createSlice({
	name: "LoginSlice",
	initialState: initState,
	reducers: {
		save: (_state, action) => {
			return action.payload;
		},
		logout: () => {
			removeCookie("member");
			return { ...initState };
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginPostAsync.fulfilled, (_state, action) => {
				if (action.payload.error) {
					return { ...initState, status: "rejected" };
				}
				const newState = { ...action.payload, status: "fulfilled" };
				setCookie("member", JSON.stringify(newState), 1);
				return newState;
			})
			.addCase(loginPostAsync.pending, (state) => {
				state.status = "pending";
			})
			.addCase(loginPostAsync.rejected, (state) => {
				state.status = "rejected";
			});
	}
});

export const { save, logout } = loginSlice.actions;

export default loginSlice.reducer;
