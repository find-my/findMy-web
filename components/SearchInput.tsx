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
    <form
      onSubmit={handleSubmit(onValid)}
      className="fixed left-0 right-0 top-0 p-3 h-24 w-full z-10  bg-white shodow  flex items-end justify-center"
    >
      <input
        {...register('searchTerm', { required: true })}
        placeholder="검색어를 입력해 주세요."
        type="text"
        className="border-2 border-blue-400 w-3/4 h-8  py-1 rounded-l pl-2  focus:border-blue-500 "
      />
      <input value="검색" type="submit" className="bg-blue-400 text-white h-8 p-1 rounded-r" />
    </form>
  );
};

export default SearchInput;
