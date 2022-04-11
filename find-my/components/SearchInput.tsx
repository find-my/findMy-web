import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  urlType: 'losts' | 'founds';
}
const SearchInput = ({ urlType }: Props) => {
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
    if (!searchTerm.trim() || !urlType) return;
    router.push({ pathname: `/${urlType}/search`, query: { searchTerm } });
  }, [searchTerm, urlType]);
  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className="border border-2">
        <input
          {...register('searchTerm', { required: true })}
          placeholder="검색어를 입력해 주세요."
          className="border border-2 w-full"
        />
        <input value="검색" type="submit" />
      </form>
    </>
  );
};

export default SearchInput;
