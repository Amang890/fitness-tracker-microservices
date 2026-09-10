import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  const user = localStorage.getItem('user');

  if (!user || user === 'undefined' || user === 'null') {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Invalid user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
  },

  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.userId = user?.sub || null;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.sub || '');
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;