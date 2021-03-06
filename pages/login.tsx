import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComment, faLock, faN } from '@fortawesome/free-solid-svg-icons';
import { FieldErrors, useForm } from 'react-hook-form';
import type { NextPage } from 'next';
import Input from '@components/auth/Input';
import Submit from '@components/auth/Submit';
import AuthLayout from '@components/auth/authLayout';
import { useEffect, useState } from 'react';
import useMutation from '@libs/front/hooks/useMutation';
import { useRouter } from 'next/router';
import useSWR from 'swr';
interface LoginForm {
  email: string;
  password: string;
  errors?: string;
}
const Login: NextPage = () => {
  const router = useRouter();

  //const { data, mutate: loginMutate } = useSWR<boolean>('isLoggedIn');
  const [login, { loading, data: loginResult, error }] = useMutation('/api/users/login', 'POST');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<LoginForm>();
  const onValid = (data: LoginForm) => {
    if (loading) return;
    login(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.dir(errors);
  };
  useEffect(() => {
    if (loginResult && loginResult.ok) {
      //loginMutate(true);
      router.push('/');
    }
  }, [router, loginResult]);
  console.log(loading, loginResult, error);
  return (
    <AuthLayout authType="로그인">
      <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex flex-col w-full  px-20 pt-6 pb-8 mb-4">
        <div>
          {errors?.email?.message}
          <Input
            register={register('email', { required: '이메일을 입력해 주세요' })}
            icon={<FontAwesomeIcon icon="user" />}
            type="email"
            placeholder="이메일"
          />
          {errors?.password?.message}
          <Input
            register={register('password', { required: '이메일을 입력해 주세요' })}
            icon={<FontAwesomeIcon icon="lock" />}
            type="password"
            placeholder="비밀번호"
          />
        </div>
        {loading ? '로그인중' : null}
        <Submit value="로그인" />
        <div className="flex justify-center text-xs mt-2 mb-8">
          <Link href="/">
            <a>아이디 찾기</a>
          </Link>
          <div className="mx-1 text-blue-400">ㅣ</div>
          <Link href="/">
            <a>비밀번호 찾기</a>
          </Link>
          <div className="mx-1 text-blue-400">ㅣ</div>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </div>

        <ul className="w-full">
          <li className="bg-yellow-400 text-black py-1.5 rounded mt-2">
            <button className="w-full relative">
              <div className="absolute left-3">
                <FontAwesomeIcon icon="comment" size="lg" />
              </div>
              <span className="text-center font-semibold">카카오 로그인</span>
            </button>
          </li>
          <li className="bg-green-500 text-white py-1.5 rounded  mt-2">
            <button className="w-full relative">
              <div className="absolute left-3">
                <FontAwesomeIcon icon="n" size="lg" />
              </div>
              <span className="text-center font-semibold">네이버 로그인</span>
            </button>
          </li>
        </ul>
      </form>
    </AuthLayout>
  );
};
export default Login;
/*
  <aside>
        <span className="text-9xl">😵</span>
        <span className="text-6xl">어딨지?</span>
      </aside>

*/
