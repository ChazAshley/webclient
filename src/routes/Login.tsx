import { Box, Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { LoginPayload } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';
import { useEffect } from 'react';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();
  const navigate = useNavigate();
  const { signIn, authState } = useAuth();
  // const isSignedIn = AuthService.isSignedIn();

  useEffect(() => {
    if (authState === true) navigate('/dashboard');
  }, [authState, navigate]);

  const submitLoginForm = async (loginPayload: LoginPayload) => {
    signIn(loginPayload);
  };

  return (
    <Container maxWidth='xs' component='main'>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant='h3'>Login page</Typography>
        <form onSubmit={handleSubmit(submitLoginForm)}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 8,
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                error={!!errors?.email}
                helperText={errors?.email?.message}
                label='Email'
                {...register('email', {
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+.[a-z]{2,3}/,
                    message: 'Invalid pattern',
                  },
                  required: 'Email is required',
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email sx={{ color: errors?.email ? 'error.main' : 'inherit' }} />
                    </InputAdornment>
                  ),
                }}
                variant='standard'
              />

              <TextField
                fullWidth
                error={!!errors?.password}
                helperText={errors?.password?.message}
                label='Password'
                {...register('password', {
                  required: 'Password is required',
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Lock
                        sx={{
                          color: errors?.password ? 'error.main' : 'inherit',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                type='password'
                variant='standard'
              />
            </Box>
            <Button variant='contained' sx={{ mt: 3 }} type='submit' fullWidth>
              Log in
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
