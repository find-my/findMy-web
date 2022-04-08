import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchInput = () => {
  const router = useRouter();

  const [searchTerm, setSearhTerm] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ searchTerm: string }>();

  const onValid = (data: { searchTerm: string }) => {
    setSearhTerm(data.searchTerm);
  };
  useEffect(() => {
    if (!searchTerm || !searchTerm.trim()) return;
    router.push({ pathname: `/lost/lostList/search`, query: { searchTerm } });
  }, [searchTerm]);
  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className="border border-2">
        <input
          {...register('searchTerm', { required: true })}
          placeholder="검색어를 입력해 주세요."
          className="border border-2 w-full"
        />
      </form>
    </>
  );
};

export default SearchInput;
