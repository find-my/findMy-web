import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useFetchUser() {
  const [user, setUser] = useState();
  const router = useRouter();
  useEffect(() => {
    fetch('/api/users/getUser')
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return router.replace('/login');
        }
        setUser(data.userData);
      });
  }, [router]);
  return user;
}
