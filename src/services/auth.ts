const authServiceState: {
  access_token?: string;
  isSignedIn?: undefined | boolean;
} = {
  access_token: undefined,
};

const registeredUseStates: Set<any> = new Set();
const nums: number[] = [];

export default {
  registerUseState: (setState: any, id: number) => {
    registeredUseStates.add(setState);
    nums.push(id);

    /*  */
  },
  removeUseState: (setState: any) => {
    if (!registeredUseStates.has(setState)) registeredUseStates.delete(setState);
    /*  */
  },
  getAccessToken: () => authServiceState.access_token,
  isSignedIn: () => authServiceState.isSignedIn,
  setAccessToken: (newToken?: string) => {
    authServiceState.access_token = newToken;
    authServiceState.isSignedIn = Boolean(newToken);

    registeredUseStates?.forEach((setState) =>
      setState((prev: any) => {
        const res = prev + 1;

        return res;
      }),
    );
  },
};
