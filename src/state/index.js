// Quan ly trong thai redux
// Co ba thanh phan: store, actions and reducers
//  - store la noi chua toan bo trang thai cua ung
//  - actions la su kien de gui du lieu tu ung dung den store. Cac actions duoc gui bang phuong thuc dispatch.
//  Action phai co thuoc tinh chi ra loai hanh dong va payload
//  - reducers la cac ham lay trang thai hien tai cua ung dung, thuc hien mot hanh dong va tra ve trang thai moi

import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state, action) => {
            state.user = null;
            state.token = null;
        }
    }
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;