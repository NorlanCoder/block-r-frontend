import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authMiddleware from './middleware/authmiddleware';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';


// Configuration de Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authReducer', 'appReducer'], 
  // blacklist: [''],
};

// Combiner les reducers
const rootReducer = combineReducers({
  authReducer,
  appReducer
});

// Reducer persisté avec le persistor
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store avec middleware personnalisé
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authMiddleware),
});

export const persistor = persistStore(store);
export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;