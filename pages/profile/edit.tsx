//사진 변경시 cloudflare 사진 삭제하도록 수정
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useUser from '@libs/front/hooks/useUser';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import useMutation from '@libs/front/hooks/useMutation';
import { classNames } from '@libs/front/utils';
import { uploadCFImage, deleteCFImage, CFImageUrl } from '@libs/front/cfImage';
import Layout from '@components/layout';
interface EditProfileForm {
  avatar: FileList;
  email?: string;
  password?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
}

const ProfileEdit: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditProfileForm>();
  //프로필 업데이트 mutation
  const [editProfile, { loading, data: editProfileResult }] = useMutation('/api/users/me', 'PUT');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  //프로필 업데이트 실행. 이미 업데이트 중이거나 form이 비워져 있으면 업데이트 진행 되지 않음.
  const avatar = watch('avatar');
  const onValid = async ({ email, phone, name, password }: EditProfileForm) => {
    if (loading) return;
    if (errors?.formErrors?.type === 'emptyForm' && !avatar) return;
    let imageId: string = '';

    if (avatarPreview && user) {
      //이미지 변경사항이 있는가?

      if (avatarPreview.includes('imagedelivery')) {
        if (user?.avatar) imageId = user?.avatar;
      } else {
        if (user?.avatar) {
          //기존 게시물에 파일이 있었다면 삭제 이 칸은 새로운 이미지가 들어왔으니 삭제 필요
          //실패 시 로직 추가하기
          deleteCFImage(user?.avatar);
        }
        const id = await uploadCFImage(avatar || [], user?.id);
        if (id) {
          imageId = id;
        }
      }
    } else if (user?.avatar) {
      //미리보기 이미지는 비어져 있지만 기존 이미지가 있을 경우 삭제 필요
      deleteCFImage(user?.avatar);
    }

    editProfile({ email, phone, name, password, avatar: imageId });
  };
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  useEffect(() => {
    if (!user) return;
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('password', '');
    setValue('phone', user.phone || '');
    if (user.avatar) {
      setAvatarPreview(CFImageUrl(user.avatar));
    }
  }, [setValue, user]);
  //모든 필드의 값들을 watch,필드 값들이 바뀔 때 마다 실행됨. form이 비워져 있으면 버튼이 비활성화 됨
  useEffect(() => {
    const subscription = watch((value) => {
      const { name, password, email, phone } = value;
      console.log(value);
      const allEmpty = name === '' && password === '' && email === '' && phone === '';
      if (allEmpty) {
        //form이 비워져 있으면 에러 설정. type을 emptyForm 으로 해둠
        setError('formErrors', { message: '변경사항 없음', type: 'emptyForm' });
      }
      if (errors?.formErrors && !allEmpty) {
        clearErrors();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  //프로필 업데이트 실행 완료
  useEffect(() => {
    if (editProfileResult && editProfileResult.ok) {
      router.push('/profile');
    }
  }, [editProfileResult, user]);
  return (
    <Layout pageTitle="프로필 수정" canGoBack={true}>
      <form onSubmit={handleSubmit(onValid)} className="mt-4 px-4 space-y-4">
        <UploadPhoto register={register('avatar')} previewImage={avatarPreview} />
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={user?.name}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            {...register('email')}
            placeholder={user?.email}
            id="email"
            type="email"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            {...register('password')}
            type="password"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            휴대폰 번호
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="text"
            placeholder={user?.phone || ''}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          className={classNames(
            'mt-5 w-full   text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ',
            errors?.formErrors?.type === 'emptyForm'
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-400 hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none',
          )}
        >
          프로필 변경
        </button>
      </form>
    </Layout>
  );
};

export default ProfileEdit;

interface IUploadPhoto {
  register: UseFormRegisterReturn;
  previewImage: string;
}
function UploadPhoto({ register, previewImage }: IUploadPhoto) {
  return (
    <div>
      <div className="flex items-center space-x-3 justify-center ">
        <div className="w-24 h-24 rounded-full mb-2 bg-slate-500 relative">
          <>
            {' '}
            {previewImage ? <img src={previewImage} className="w-24 h-24 rounded-full mb-2 bg-slate-500 z-10" /> : null}
          </>
          <label
            htmlFor="picture"
            className="absolute bottom-1 -right-1 cursor-pointer text-white bg-gray-700 p-1 rounded-full "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <input {...register} id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  );
}
