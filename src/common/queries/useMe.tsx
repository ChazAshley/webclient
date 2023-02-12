import { useQuery } from '@tanstack/react-query';
import { getUserAPI } from '~/api/user';

export default function useMe(enabled = true) {
  return useQuery(['me'], getUserAPI, { enabled });
}
