import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import { GlobalContextType } from '~/contexts/global';
import { AuthContext, AuthContextType } from '~/contexts/auth';

const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const NavButton = styled(Button)(({ theme }) => {
  return {
    color: theme.palette.primary.contrastText,
    alignSelf: 'center',
  };
}) as typeof Button;

export const Nav = ({ authState: isLoggedIn, signOut }: AuthContextType) => {
  return (
    <AppBar position='sticky' sx={{ justifyContent: 'center' }}>
      <StyledToolbar>
        <NavButton component={Link} to='/'>
          Home
        </NavButton>
        <NavButton sx={{ marginLeft: 'auto' }} component={Link} to='/about'>
          About
        </NavButton>
        |
        {!isLoggedIn ? (
          <>
            <NavButton component={Link} to='/register'>
              Register
            </NavButton>
            <NavButton component={Link} to='/login'>
              Login
            </NavButton>
          </>
        ) : (
          <NavButton onClick={signOut}>Logout</NavButton>
        )}
      </StyledToolbar>
    </AppBar>
  );
};
