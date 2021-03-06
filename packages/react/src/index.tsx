import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
} from 'react';
import { Router } from '@routo/core';

export const Context = createContext<Router | null>(null);

export type ProviderProps = {
  router: Router;
};

export const Provider: FC<ProviderProps> = ({ router, children }) => (
  <Context.Provider value={router}>{children}</Context.Provider>
);

export const useRouter = (): Router => {
  const router = useContext(Context);

  if (!router) {
    throw new Error(
      'Could not find @routo/react context value; please ensure the component is wrapped in a <Provider>',
    );
  }

  return router;
};

export const useRouterState = () => {
  const router = useRouter();
  const [state, setState] = useState(router.getState());

  useEffect(() => {
    let didCancel = false;

    const unsubscribe = router.subscribe((newState) => {
      if (!didCancel) {
        setState(newState);
      }
    });

    return () => {
      didCancel = true;
      unsubscribe();
    };
  }, [router]);

  return state;
};
