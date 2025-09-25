import { createSlice } from '@reduxjs/toolkit';

export interface CommuneType {
  code_com: string;
  lib_com: string;
  code_dep: string;
  code_circ: string;
}
export interface DepartementType {
  code_dep: string;
  lib_dep: string;
}
export interface CirconscriptionType {
  code_circ: string;
  lib_circ: string;
  code_dep: string;
  lib_iso: string;
}

const initialAppState = {
  communes: [] as CommuneType[],
  departements: [] as DepartementType[],
  circonscriptions: [] as CirconscriptionType[],
  prix: 1000
}


// Création du slice
export const appSlice = createSlice({
  name: 'appReducer',
  initialState: initialAppState,
  reducers: {
    setCommunes: (state, action) => {
      state.communes = action.payload;
    },
    setDepartements: (state, action) => {
      state.departements = action.payload;
    },
    setCirconscriptions: (state, action) => {
      state.circonscriptions = action.payload;
    },
    setPrice: (state, action) => {
      state.prix = action.payload.prix;
    }
  },
});

export const { setCommunes, setDepartements, setCirconscriptions, setPrice } = appSlice.actions;
export default appSlice.reducer;