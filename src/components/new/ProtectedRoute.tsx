import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Navigate } from 'react-router';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.authReducer.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/connexion" />;
}