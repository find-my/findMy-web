//post/upload
//분실물 게시물 업로드 페이지
import { NextPage } from 'next';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import UploadButton from '@components/UploadButton';
import { useCallback, useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import PlaceFinder from 'components/Map/placeFinder';
import useMutation from '@libs/front/hooks/useMutation';
import { Post, PostType } from '@prisma/client';
import useUser from '@libs/front/hooks/useUser';
import { uploadCFImage } from '@libs/front/cfImage';
import UploadPhotoBlock from '@components/Post/UploadPhotoBlock';

interface postForm {
  image1?: FileList;
  image2?: FileList;
  image3?: FileList;
  title: string;
  category: string;
  description: string;
}

//upload 결과 interface
interface UploadPostState {
  ok: boolean;
  message?: string;
  post?: Post;
}

//물품 category found 업로드와 겹치므로 분리 예정.
const CATEGORY = [
  '선택안함',
  '가방',
  '지갑',
  '카드/현금',
  '의류',
  '휴대폰',
  '전자기기',
  '귀금속',
  '도서용품',
  '서류/증명서',
  '스포츠용품',
  '악기',
  '자동차관련',
  '가방',
  '기타',
];
interface IpostPlace {
  place: string;
  latitude?: number;
  longitude?: number;
}

//분실물을 잃어 버린 위치를 모르겠을 때 설정 값. found 와 겹치므로 분리 예정
const POSTPLACE_NULL = '모르겠음';

const Upload: NextPage = () => {
  const { user } = useUser();
  const [uploadPost, { loading, data: uploadResult, error }] = useMutation<UploadPostState>('/api/posts', 'POST'); //post 생성 mutation
  const router = useRouter();
  const [postPlace, setPostPlace] = useState<IpostPlace>({ place: '' }); //postPlace 상태 관리
  const [isPlaceFinderOpen, setIsPlaceFinderOpen] = useState<boolean>(false); //postPlace 설정을 위한 페이지 생성 여부
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    resetField,
  } = useForm<postForm>();
  const [imagePreview1, setImagePreview1] = useState<string>('');
  const [imagePreview2, setImagePreview2] = useState<string>('');
  const [imagePreview3, setImagePreview3] = useState<string>('');
  //upload Form 이 채워지면 POST
  const onValid = async (data: postForm) => {
    if (loading || !user) return;
    if (!postPlace.place || !postPlace.place.trim()) return;
    let imageIds: string[] = [];
    await Promise.all(
      [image1, image2, image3].map(async (image) => {
        if (image && image.length > 0) {
          const id = await uploadCFImage(image || [], user?.id);
          if (id) {
            imageIds?.push(id);
          }
        }
      }),
    );
    uploadPost({ ...data, ...postPlace, photos: imageIds, postType: PostType.FOUND });
  };
  //
  const placeFinderOpen = () => {
    setIsPlaceFinderOpen(true);
  };

  //모르겠음 버튼 클릭 이벤트
  const onUnKnownClick = () => {
    setPostPlace({ place: POSTPLACE_NULL });
  };

  const image1 = watch('image1');
  const image2 = watch('image2');
  const image3 = watch('image3');

  useEffect(() => {
    if (image1 && image1.length > 0) {
      const file = image1[0];
      setImagePreview1(URL.createObjectURL(file));
    }
  }, [image1]);
  useEffect(() => {
    if (image2 && image2.length > 0) {
      const file = image2[0];

      setImagePreview2(URL.createObjectURL(file));
    }
  }, [image2]);
  useEffect(() => {
    if (image3 && image3.length > 0) {
      const file = image3[0];

      setImagePreview3(URL.createObjectURL(file));
    }
  }, [image3]);
  //업로드가 완료 되었으면 /post/id로 이동
  useEffect(() => {
    if (uploadResult?.ok) {
      console.log('업로드 완료');
      //상태 값 리셋
      setPostPlace({ place: '' });
      setImagePreview1('');
      setImagePreview2('');
      setImagePreview3('');
      reset();
      router.push(`/losts/${uploadResult.post?.id}`);
    }
  }, [uploadResult, router]);

  return (
    <>
      {!isPlaceFinderOpen ? (
        <div>
          <form onSubmit={handleSubmit(onValid)} className="px-4 py-16">
            <div className="flex space-x-4 border-b pb-4">
              <UploadPhotoBlock
                register={register('image1')}
                previewImage={imagePreview1}
                clear={() => {
                  resetField('image1');
                  setImagePreview1('');
                }}
              />
              <UploadPhotoBlock
                register={register('image2')}
                previewImage={imagePreview2}
                clear={() => {
                  resetField('image2');
                  setImagePreview2('');
                }}
              />
              <UploadPhotoBlock
                register={register('image3')}
                previewImage={imagePreview3}
                clear={() => {
                  resetField('image3');
                  setImagePreview3('');
                }}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="title">분실물명</label>
              <div className="mt-1">
                <input
                  {...register('title', { required: true })}
                  id="title"
                  className=" w-full rounded"
                  type="text"
                  placeholder="제목을 입력해 주세요."
                />
              </div>
            </div>
            <div className="mt-2 space-x-2">
              <label htmlFor="postCategory">카테고리</label>
              <select {...register('category')} className="rounded" id="postCategory">
                {CATEGORY.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <span>잃어 버린 곳</span>
                <span className="text-blue-400">{postPlace.place}</span>
              </div>
              <div
                onClick={placeFinderOpen}
                className="w-1/2 cursor-pointer flex items-center bg-blue-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-1 "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span onClick={placeFinderOpen}>지도에 위치 표시하기</span>
              </div>

              <div
                onClick={onUnKnownClick}
                className="w-1/2 cursor-pointer flex items-center bg-blue-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-1 "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>모르겠음</span>
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="description">설명</label>
              <div className="mt-1">
                <textarea
                  {...register('description', { required: true })}
                  id="description"
                  className="w-full rounded"
                  rows={10}
                />
              </div>
            </div>
            {loading ? '업로드중' : null}
            <UploadButton isCompleted={errors !== null} />
          </form>
        </div>
      ) : (
        <PlaceFinder
          setOpenFalse={() => setIsPlaceFinderOpen(false)}
          setPostPlace={(place: IpostPlace) => setPostPlace(place)}
          postPlace={postPlace}
        />
      )}
    </>
  );
};

export default Upload;
