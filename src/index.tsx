import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from './contexts/auth';

import { createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Dashboard } from './routes/Dashboard';

import { Link, createBrowserRouter, RouterProvider, defer } from 'react-router-dom';
import { About } from './routes/About';

import { Login } from './routes/Login';
import { Register } from './routes/Register';

import { Layout } from './routes/Layout';
import apiClient from '~/api';
import { GlobalContextProvider } from './contexts/global';
import { ERROR_CODE } from './api/auth';
import { RequireAuth } from './components/RequireAuth';

const theme = createTheme();
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (attemptIndex, err: any) => {
        if (
          err?.response?.data?.code === 401 &&
          err?.response?.data?.errorCode === ERROR_CODE.REFRESH_TOKEN
        )
          return false;
        if (attemptIndex === 3) return false;
        return true;
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/about', element: <About /> },
      {
        path: '/login',
        element: <Login />,
      },
      { path: '/register', element: <Register /> },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: '/dashboard1',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <main>
        <p>Тут ніц нема</p>
        <Link to='/home'>Домів</Link>
      </main>
    ),
  },
]);

const Root = () => {
  return <RouterProvider router={browserRouter} />;
};

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider axiosClient={apiClient}>
        <GlobalContextProvider>
          <ThemeProvider theme={theme}>
            <Root />
          </ThemeProvider>
        </GlobalContextProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
