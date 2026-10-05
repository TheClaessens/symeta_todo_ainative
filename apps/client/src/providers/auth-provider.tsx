import * as React from 'react';
import { Constants } from '@repo/shared';

interface User {
  access_token: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthAction = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem(Constants.USERNAME, action.payload.username);
      localStorage.setItem(Constants.ACCESS_TOKEN, action.payload.access_token);
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      localStorage.removeItem(Constants.USERNAME);
      localStorage.removeItem(Constants.ACCESS_TOKEN);
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export interface AuthContextProps {
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(
    authReducer,
    {
      user: null,
      isAuthenticated: false,
    },
    () => {
      // Initializer function for lazy state initialization
      const username = localStorage.getItem(Constants.USERNAME);
      const accessToken = localStorage.getItem(Constants.ACCESS_TOKEN);
      const user =
        username && accessToken
          ? { username, access_token: accessToken }
          : null;
      return {
        user,
        isAuthenticated: !!user,
      };
    }
  );

  const login = React.useCallback((_user: User) => {
    dispatch({ type: 'LOGIN', payload: _user });
  }, []);

  const logout = React.useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = React.useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      login,
      logout,
    }),
    [state.isAuthenticated, state.user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
