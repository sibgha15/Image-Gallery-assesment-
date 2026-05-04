import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type RegisteredUser = {
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  isRegistered: boolean;
  user: RegisteredUser | null;
};

const initialState: AuthState = {
  isRegistered: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerSuccess: (state, action: PayloadAction<RegisteredUser>) => {
      state.isRegistered = true;
      state.user = action.payload;
    },
    logout: state => {
      state.isRegistered = false;
      state.user = null;
    },
  },
});

export const { registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
