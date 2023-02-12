import { useQuery } from '@tanstack/react-query';
import { Suspense, useContext, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { getUserAPI, getUsersAPI, MeResponse } from '~/api/user';
import { GlobalContext } from '~/contexts/global';

export const Dashboard = () => {
  const {
    me: { data, error },
  } = useContext(GlobalContext);
  const [show, setShow] = useState(true);
  // const {
  //   data: users,
  //   error,
  //   refetch,
  // } = useQuery(['users'], getUsersAPI, { retry: 0, cacheTime: 1000 * 60, staleTime: 1000 * 30 });
  //
  return (
    <>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : error ? 'error' : 'loading...'}
      {/**
        <Suspense fallback={<p>цей во, зара буде...</p>}>
        <Await resolve={users} errorElement={<p>шось ся тряпило</p>}>
        {(usersResponse: { data: { data: MeResponse[] } }) => (
        <div>
        {usersResponse?.data?.data?.map((aUser) => (
        <div key={aUser.id}>{aUser.email}</div>
        ))}
        </div>
        )}
        </Await>
        </Suspense>
        */}
      <button onClick={() => setShow((st) => !st)}>toggle</button>
      {show && 'hello'},
    </>
  );
};
