import { Email, Lock, Person } from '@mui/icons-material';
import { Box, Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  isFormValidationError,
  registerAPI,
  RegisterPayload,
  RegisterRequestError,
} from '../api/auth';

export const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }>();
  const currentPassword = watch('password');
  const submitLoginForm = async (payload: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    try {
      await registerAPI(payload);
    } catch (err: unknown) {
      const error = err as AxiosError<RegisterRequestError>;

      if ((error?.response?.data as { fields?: object })?.fields) {
        const fields = (error?.response?.data as { fields?: object })?.fields;
        Object.entries(fields).forEach(([fieldName, errorCode]) => {
          setError(fieldName as 'name', { message: errorCode });
        });
      } else {
        const msg = (error as AxiosError)?.response?.data?.message;

        toast.error(msg);
      }
    }
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
                error={!!errors?.name}
                helperText={errors?.name?.message}
                label='Name'
                {...register('name', {
                  minLength: {
                    value: 3,
                    message: 'Length should be 3 or more letters',
                  },
                  pattern: {
                    value: /^[a-zA-z][a-zA-Z0-9]{0,199}$/,
                    message: 'Name should only contain letters and numbers',
                  },
                  required: 'Name is required',
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Person
                        sx={{
                          color: errors?.name ? 'error.main' : 'inherit',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                variant='standard'
              />
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

              <TextField
                fullWidth
                error={!!errors?.passwordConfirm}
                helperText={errors?.passwordConfirm?.message}
                label='Confirm password'
                {...register('passwordConfirm', {
                  required: 'Password confirmation is required',
                  validate: (value) =>
                    value !== currentPassword ? 'Passwords should match' : undefined,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Lock
                        sx={{
                          color: errors?.passwordConfirm ? 'error.main' : 'inherit',
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
