/* eslint-disable react/jsx-no-undef */
import { Button, CircularProgress, Container, Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Nav } from '~/components/Nav';
import { AuthContext } from '~/contexts/auth';
import useConjunction from '~/hooks/conjunction';

export const Layout = () => {
  const auth = useContext(AuthContext);

  useConjunction();

  // eslint-disable-next-line no-constant-condition
  if (auth.authState === undefined)
    return (
      <div style={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
        <CircularProgress value={0} />
      </div>
    );

  return (
    <>
      <Nav {...auth} />
      <Outlet />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
