import { Middleware } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

const authMiddleware: Middleware = ({ getState, dispatch }) => (next) => (action) => {
  const state = getState();
  const currentTime = Date.now();
  const tokenCreationTime = state.authReducer.tokenCreationTime;

  const result = next(action);

    // Éviter les actions pendant la réhydratation
  if (action.type === 'persist/REHYDRATE') {
    return result;
  }

  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    tokenCreationTime &&
    currentTime - tokenCreationTime > 24 * 60 * 60 * 1000 && // 24 heures
    action.type !== logout.type
  ) {
    dispatch(logout());
    console.warn('Token expiré, utilisateur déconnecté automatiquement.');
    window.location.href = '/connexion';
    return;
  }

  return result;
};

export default authMiddleware;