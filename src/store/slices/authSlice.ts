import { createSlice } from '@reduxjs/toolkit';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  photo: string;
  status: string;
}
export interface AuthState {
  token: string;
  tokenCreationTime: number | null;
  user: User;
  isAuthenticated: boolean;
}

const initialUser: User = {
  id: '',
  nom: '',
  prenom: '',
  role: '',
  email: '',
  telephone: '',
  photo: '',
  status: ''
};

// Initial state
const initialAuthState = {
  token: '',
  tokenCreationTime: null as number | null,
  user: initialUser,
  isAuthenticated: false
};


// Création du slice
export const authSlice = createSlice({
  name: 'authReducer',
  initialState: initialAuthState,
  reducers: {
    loginauth: (state, action) => {
      state.token = action.payload.token;
      state.tokenCreationTime = new Date().getTime();
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = '';
      state.tokenCreationTime = null;
      state.user = initialUser;
      state.isAuthenticated = false;
      
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        telephone: action.payload.telephone,
        nom: action.payload.nom,
        prenom: action.payload.prenom
      };
    }
  },
});

export const { loginauth, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;