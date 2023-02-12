import privateAxiosInstance, { axiosInstance } from '~/api';

export enum ERROR_CODE {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export type LoginPayload = { email: string; password: string };
export type LoginSuccess = {
  status: 'success';
  access_token: string;
};
export type RegisterPayload = { name: string; email: string; password: string };
export type RegisterSuccess = LoginSuccess;
export type RefreshAccessTokenSuccess = LoginSuccess;
export type Login404Error = {
  status: 'failure';
  message: string;
};
export interface GenericServerError {
  message: string;
}
export type AccessTokenError = GenericServerError;
export interface RefreshTokenError extends GenericServerError {
  errorCode: ERROR_CODE.REFRESH_TOKEN;
}
/* case 'required': { */
/*   return { [params.missingProperty]: keyword }; */
/* } */
/* case 'format': */
/* case 'pattern': */
/* case 'minLength': { */
export type FieldValidationError = 'required' | 'format' | 'pattern' | 'minLength';
export type FormValidationError<TPayload> = {
  fields: Partial<Record<keyof TPayload, FieldValidationError>>;
};
export type LoginRequestError = Login404Error | AccessTokenError | GenericServerError;
export type RegisterRequestError = FormValidationError<RegisterPayload> | GenericServerError;

export function isFormValidationError<TPayload>(
  error: unknown,
): error is FormValidationError<TPayload> {
  return Boolean((error as FormValidationError<TPayload>)?.fields);
}

export const refreshTokenAPI = () =>
  axiosInstance.get<RefreshAccessTokenSuccess>('/refresh-access-token', {
    withCredentials: true,
  });

export const loginAPI = (loginPayload: LoginPayload) =>
  privateAxiosInstance.post<LoginSuccess>('/login', loginPayload, {
    withCredentials: true,
  });

export const logoutAPI = () =>
  privateAxiosInstance.post<{ status: 'success' }>(
    '/logout',
    {},
    {
      withCredentials: true,
    },
  );

export const registerAPI = (registerPayload: RegisterPayload) =>
  privateAxiosInstance.post('/register', registerPayload);
