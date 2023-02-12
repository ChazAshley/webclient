import privateAxiosInstance from '~/api';

export type MeResponse = {
  email: string;
  email_verified: boolean;
  id: number;
  name: string;
};

export const getUserAPI = () => {
  return privateAxiosInstance.get<MeResponse>('/me');
};

export const getUsersAPI = () => {
  return privateAxiosInstance.get<MeResponse[]>('/users');
};
