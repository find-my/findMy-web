import { useState } from 'react';

interface PostState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UsePostResult<T> = [(data: any) => void, PostState<T>];
export default function useMutation<T = any>(url: string, method: 'POST' | 'PUT' | 'DELETE'): UsePostResult<T> {
  const [state, setState] = useState<PostState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  const mutateFunc = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data, loading: false })))
      .catch((error) => setState((prev) => ({ ...prev, error, loading: false })));
  };
  return [mutateFunc, { ...state }];
}
