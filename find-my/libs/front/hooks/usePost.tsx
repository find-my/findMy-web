import { prepareServerlessUrl } from 'next/dist/server/base-server';
import { useState } from 'react';

interface PostState {
  loading: boolean;
  data?: object;
  error?: object;
}
type UsePostResult = [(data: any) => void, PostState];
export default function usePost(url: string): UsePostResult {
  const [state, setState] = useState<PostState>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  const postFunc = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  };
  return [postFunc, { ...state }];
}
