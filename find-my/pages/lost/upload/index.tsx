import { NextPage } from 'next';
import { FieldErrors, useForm } from 'react-hook-form';
import UploadButton from '@components/UploadButton';
import { useCallback, useState, useEffect } from 'react';
import { LOST_PLACE } from '@libs/front/swrKey';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import Router, { useRouter } from 'next/router';
import PlaceFinder from 'components/Map/placeFinder';
import useMutation from '@libs/front/hooks/useMutation';
import { Lost } from '@prisma/client';
interface LostForm {
  images?: string[];
  title: string;
  category: string;
  description: string;
}
interface UploadLostState {
  ok: boolean;
  message?: string;
  lost?: Lost;
}
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
const LOSTPLACE_NULL = '모르겠음';
const Upload: NextPage = () => {
  const [uploadLost, { loading, data: uploadResult, error }] = useMutation<UploadLostState>('/api/losts', 'POST');
  const router = useRouter();
  const [lostPlace, setLostPlace] = useState<string>('');
  //const { data: lostPlaceData, mutate: lostPlaceMutate } = useSWR<string>(LOST_PLACE, () => lostPlace);

  //console.log(lostPlaceData);
  const [isPlaceFinderOpen, setIsPlaceFinderOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<LostForm>();
  const onValid = (data: LostForm) => {
    console.log(data, loading);
    if (loading) return;
    if (!lostPlace || !lostPlace.trim()) return;
    if (lostPlace === LOSTPLACE_NULL) uploadLost({ ...data });
    else {
      uploadLost({ ...data, lostPlace });
    }
  };
  const onInvalid = (errors: FieldErrors) => {
    console.dir(errors);
  };
  const placeFinderOpen = () => {
    setIsPlaceFinderOpen(true);
  };
  const onUnKnownClick = () => {
    setLostPlace(LOSTPLACE_NULL);
  };

  useEffect(() => {
    if (uploadResult?.ok) {
      console.log('업로드 완료');
      setLostPlace('');
      router.push(`/lost/${uploadResult.lost?.id}`);
    }
  }, [uploadResult, router]);
  return (
    <>
      {!isPlaceFinderOpen ? (
        <div>
          <form onSubmit={handleSubmit(onValid)} className="px-4 py-16">
            <div>
              <div className="flex space-x-4 border-b pb-4">
                <div className="flex flex-col items-center justify-center border border-slate-400 rounded w-20 h-20">
                  <label className="hover:text-blue-400 cursor-pointer">
                    <svg className="h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input className="hidden" type="file" />
                  </label>
                  <span className="-mt-2 ">2/10</span>
                </div>
                <div className="w-20 h-20 bg-slate-500 rounded relative">
                  <button className="absolute text-white p-1 bg-black rounded-full -right-1 -top-1">
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
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <div className="text-white bg-black w-20 text-center rounded-b absolute bottom-0 ">대표사진</div>
                </div>
                <div className="w-20 h-20 bg-slate-500 rounded relative">
                  <button className="absolute text-white p-1 bg-black rounded-full -right-1 -top-1">
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
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="title">제목</label>
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
              <label htmlFor="lostCategory">카테고리</label>
              <select {...register('category')} className="rounded" id="lostCategory">
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
                <span className="text-blue-400">{lostPlace}</span>
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
          setLostPlace={(place: string) => setLostPlace(place)}
          lostPlace={lostPlace}
        />
      )}
    </>
  );
};

export default Upload;
/* <span>영통역 수인분당선</span> */
/*
 {CATEGORY.map((option) => (
                  <option value={option.value}>{option.name}</option>
                ))}
*/
/*
  <option value='선택안함'>선택안함</option>
                <option value="가방">가방</option>
                <option value="지갑">지갑</option>
                <option value="카드/현금">카드/현금</option>
                <option value="의류">의류</option>
                <option value='휴대폰'>휴대폰</option>
                <option value="전자기기">전자기기</option>
                <option value="귀금속">귀금속</option>
                <option value="도서용품">도서용품</option>
                <option value="서류/증명서">서류/증명서</option>
                <option value='스포츠용품'>스포츠용품</option>
                <option value="악기">악기</option>
                <option value="자동차관련">자동차관련</option>
                <option value="기타">기타</option>
*/
