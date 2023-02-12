import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '~/contexts/global';

const publicRoutePaths = ['/about', '/login', '/register', '/'];

export default function useConjunction() {
  const { authState } = useContext(GlobalContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState === false && !publicRoutePaths.includes(pathname)) {
      console.log('logged out');
      navigate('/login');
    }
    if (authState === true && publicRoutePaths.includes(pathname)) {
      console.log('logged in');
      navigate('/dashboard');
    }
  }, [authState, navigate, pathname]);
}
