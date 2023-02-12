import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Await, Navigate, useLoaderData, useLocation } from 'react-router-dom';
import { MeResponse } from '~/api/user';
import { AuthContext } from '~/contexts/auth';
import AuthService from '~/services/auth';

export function RequireAuth({ children }: { children: JSX.Element }): JSX.Element | null {
  const auth = useContext(AuthContext);
  switch (auth.authState) {
    case false:
      return <Navigate to='/login' state={{ from: location }} replace />;
    case true:
      return children;
    default:
      return null;
  }
}
