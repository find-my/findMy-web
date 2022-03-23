import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faMobilePhone, faA } from '@fortawesome/free-solid-svg-icons';
import { FieldErrors, useForm } from 'react-hook-form';
import type { NextPage } from 'next';
import Input from '@components/auth/Input';
import usePost from '@libs/front/hooks/usePost';
interface SignUpForm {
  name: string;
  email: string;
  password: string;
  phone?: number;
  errors?: string;
}
const SignUp: NextPage = () => {
  const [signUp, { loading, data, error }] = usePost('/api/users/signup');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SignUpForm>();
  const onValid = (data: SignUpForm) => {
    if (loading) return;
    signUp(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.dir(errors);
  };
  console.log(loading, data, error);
  return (
    <main className="mt-16 w-full">
      <h3 className="text-5xl font-nanum-pen-script text-blue-400 text-center">어딨지?</h3>
      <div className="mt-12">
        <div className="flex flex-col items-center ">
          <h5 className="text-lg font-bold mb-3">회원가입</h5>
          <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex flex-col w-full  px-20 pt-6 pb-8 mb-4">
            <div>
              {errors?.name?.message}
              <Input
                register={register('name', { required: '이름을 입력해 주세요' })}
                icon={<FontAwesomeIcon icon={faA} />}
                type="text"
                placeholder="이름"
              />
              {errors?.email?.message}
              <Input
                register={register('email', { required: '이메일을 입력해 주세요' })}
                icon={<FontAwesomeIcon icon={faUser} />}
                type="email"
                placeholder="이메일"
              />
              {errors?.password?.message}
              <Input
                register={register('password', { required: '이메일을 입력해 주세요' })}
                icon={<FontAwesomeIcon icon={faLock} />}
                type="password"
                placeholder="비밀번호"
              />
              {errors?.phone?.message}
              <Input
                register={register('phone', { required: '전화번호를 입력해 주세요' })}
                icon={<FontAwesomeIcon icon={faMobilePhone} />}
                type="text"
                placeholder="전화번호"
              />
            </div>
            {loading ? '계정 생성 중' : null}
            <input
              className=" bg-blue-400 text-center text-white font-semibold py-3 rounded "
              type="submit"
              value="회원가입"
            />
            <div className="flex justify-center text-xs mt-2 mb-8">
              <span>계정이 있으신가요?</span>
              <Link href="/">
                <a id="link-signup">로그인</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
export default SignUp;
