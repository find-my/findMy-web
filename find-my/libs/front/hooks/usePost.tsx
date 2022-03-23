import { useState } from 'react';

interface PostState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
type UsePostResult<T> = [(data: any) => void, PostState<T>];
export default function usePost<T = any>(url: string): UsePostResult<T> {
  const [state, setState] = useState<PostState<T>>({
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
      .then((data) => setState((prev) => ({ ...prev, data, loading: false })))
      .catch((error) => setState((prev) => ({ ...prev, error, loading: false })));
  };
  return [postFunc, { ...state }];
}
