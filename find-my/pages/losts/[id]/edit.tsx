//lost/upload
//분실물 게시물 업로드 페이지
import { NextPage } from 'next';
import { FieldErrors, useForm, UseFormRegisterReturn } from 'react-hook-form';
import UploadButton from '@components/UploadButton';
import { useCallback, useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import PlaceFinder from 'components/Map/placeFinder';
import useMutation from '@libs/front/hooks/useMutation';
import { Lost, LostPhoto } from '@prisma/client';
import useUser from '@libs/front/hooks/useUser';
import useSWR from 'swr';
import { LostDetailResponse } from '../../../typeDefs/lost';

interface LostForm {
  image1?: FileList;
  image2?: FileList;
  image3?: FileList;
  title: string;
  category: string;
  description: string;
  errorMessage?: string;
}

//upload 결과 interface
interface MutateLostState {
  ok: boolean;
  message?: string;
  lost?: Lost;
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
interface ILostPlace {
  place: string;
  latitude?: number;
  longitude?: number;
}

//분실물을 잃어 버린 위치를 모르겠을 때 설정 값. found 와 겹치므로 분리 예정
const LOSTPLACE_NULL = '모르겠음';

const Upload: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [editLost, { loading, data: editResult, error }] = useMutation<MutateLostState>(
    `/api/losts/${router.query.id}`,
    'PUT',
  ); //lost 생성 mutation
  const { data: prevLost } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const [lostPlace, setLostPlace] = useState<ILostPlace>({ place: '' }); //lostPlace 상태 관리
  const [isPlaceFinderOpen, setIsPlaceFinderOpen] = useState<boolean>(false); //lostPlace 설정을 위한 페이지 생성 여부
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    resetField,
    setError,
  } = useForm<LostForm>();
  const [imagePreview1, setImagePreview1] = useState<string>('');
  const [imagePreview2, setImagePreview2] = useState<string>('');
  const [imagePreview3, setImagePreview3] = useState<string>('');

  //upload Form 이 채워지면 POST
  const onValid = async (data: LostForm) => {
    if (loading) return;
    if (!lostPlace.place || !lostPlace.place.trim()) return;
    let imageIds: string[] = [];
    const images = [image1, image2, image3];
    await Promise.all(
      [imagePreview1, imagePreview2, imagePreview3].map(async (imagePreview, i) => {
        if (imagePreview && user) {
          //이미지 변경사항이 있는가?
          console.log(imagePreview);
          if (imagePreview.includes('imagedelivery')) {
            if (prevLost?.lost?.photos[i]?.file) imageIds?.push(prevLost?.lost?.photos[i].file);
            console.log(imageIds, 95);
          } else {
            if (prevLost?.lost?.photos[i]?.file) {
              //기존 게시물에 파일이 있었다면 삭제 이 칸은 새로운 이미지가 들어왔으니 삭제 필요

              //실패 시 로직 추가하기
              await (
                await fetch(`/api/files`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ deleteFileId: prevLost?.lost?.photos[i]?.file }),
                })
              ).json(); //삭제 처리 되었는지 확인 필요
            }

            if (images[i] && (images[i]?.length || -1) > 0) {
              console.log((images[i] || [])[0]);
              const { uploadURL } = await (await fetch(`/api/files`)).json();
              const form = new FormData();
              form.append('file', (images[i] || [])[0], user?.id + '');
              const {
                result: { id },
              } = await (
                await fetch(uploadURL, {
                  method: 'POST',
                  body: form,
                })
              ).json();
              imageIds?.push(id);
              console.log(imageIds, 125);
            }
          }
        } else if (prevLost?.lost?.photos[i]) {
          //미리보기 이미지는 비어져 있지만 기존 이미지가 있을 경우 삭제 필요
          await (
            await fetch(`/api/files`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ deleteFileId: prevLost?.lost?.photos[i].file }),
            })
          ).json(); //삭제 처리 되었는지 확인 필요
        }
      }),
    );

    console.log(imageIds);
    editLost({ ...data, ...lostPlace, photos: imageIds });
  };
  //
  const placeFinderOpen = () => {
    setIsPlaceFinderOpen(true);
  };

  //모르겠음 버튼 클릭 이벤트
  const onUnKnownClick = () => {
    setLostPlace({ place: LOSTPLACE_NULL });
  };

  const image1 = watch('image1');
  const image2 = watch('image2');
  const image3 = watch('image3');
  useEffect(() => {
    if (prevLost && prevLost.lost) {
      setValue('title', prevLost.lost.title);
      setValue('description', prevLost.lost.description);
      setValue('category', prevLost.lost.category);
      setLostPlace({
        place: prevLost.lost.lostPlace || '',
        latitude: prevLost?.lost?.latitude || undefined,
        longitude: prevLost?.lost?.latitude || undefined,
      });

      setImagePreview1(
        prevLost?.lost?.photos && prevLost?.lost?.photos[0]
          ? `https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${prevLost?.lost?.photos[0].file}/public`
          : '',
      );
      setImagePreview2(
        prevLost?.lost?.photos && prevLost?.lost?.photos[1]
          ? `https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${prevLost?.lost?.photos[1].file}/public`
          : '',
      );
      setImagePreview3(
        prevLost?.lost?.photos && prevLost?.lost?.photos[2]
          ? `https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${prevLost?.lost?.photos[2].file}/public`
          : '',
      );
    }
  }, [setValue, prevLost]);
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
  //업로드가 완료 되었으면 /lost/id로 이동
  useEffect(() => {
    if (editResult?.ok) {
      console.log('업로드 완료');
      //상태 값 리셋
      setLostPlace({ place: '' });
      setImagePreview1('');
      setImagePreview2('');
      setImagePreview3('');
      reset();
      router.push(`/losts/${router?.query?.id}`);
    }
  }, [editResult, router]);
  console.log(prevLost);
  return (
    <>
      {!isPlaceFinderOpen ? (
        <div>
          <form onSubmit={handleSubmit(onValid)} className="px-4 py-16">
            <div className="flex space-x-4 border-b pb-4">
              <UploadPhoto
                isFirst={true}
                register={register('image1')}
                previewImage={imagePreview1}
                clear={() => {
                  resetField('image1');
                  setImagePreview1('');
                }}
              />
              <UploadPhoto
                register={register('image2')}
                previewImage={imagePreview2}
                clear={() => {
                  resetField('image2');
                  setImagePreview2('');
                }}
              />
              <UploadPhoto
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
                <span className="text-blue-400">{lostPlace.place}</span>
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
            {error}
            <UploadButton isCompleted={errors !== null} />
          </form>
        </div>
      ) : (
        <PlaceFinder
          setOpenFalse={() => setIsPlaceFinderOpen(false)}
          setLostPlace={(place: ILostPlace) => setLostPlace(place)}
          lostPlace={lostPlace}
        />
      )}
    </>
  );
};

export default Upload;

interface IUploadPhoto {
  isFirst?: boolean;
  register: UseFormRegisterReturn;
  previewImage?: string;
  clear: () => void;
}
function UploadPhoto({ isFirst = false, register, previewImage, clear }: IUploadPhoto) {
  return (
    <div>
      {!previewImage ? (
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
            <input {...register} className="hidden" type="file" accept="image/*" />
          </label>
          <span className="-mt-2 ">사진추가</span>
        </div>
      ) : (
        <div className="w-20 h-20 bg-slate-500 rounded relative z-10">
          <img src={previewImage} className="w-20 h-20 bg-slate-500 rounded" />
          <button onClick={clear} className="absolute text-white p-1 bg-black rounded-full -right-1 -top-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          {isFirst ? (
            <div className="text-white bg-black w-20 text-center rounded-b absolute bottom-0 ">대표사진</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

/*    if (imagePreview1 && user) {
      //이미지 변경사항이 있는가?
      if (imagePreview1.includes('imagedelivery')) {
        if (prevLost?.lost?.photos[0]?.file) imageIds?.push(prevLost?.lost?.photos[0].file);
      } else {
        if (prevLost?.lost?.photos[0]?.file) {
          //기존 게시물에 파일이 있었다면 삭제 이 칸은 새로운 이미지가 들어왔으니 삭제 필요

          //실패 시 로직 추가하기
          await (
            await fetch(`/api/files`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ deleteFileId: prevLost?.lost?.photos[0]?.file }),
            })
          ).json(); //삭제 처리 되었는지 확인 필요
        }
        if (image1 && image1.length > 0) {
          const { uploadURL } = await (await fetch(`/api/files`)).json();
          const form = new FormData();
          form.append('file', image1[0], user?.id + '');
          const {
            result: { id },
          } = await (
            await fetch(uploadURL, {
              method: 'POST',
              body: form,
            })
          ).json();
          imageIds?.push(id);
        }
      }
    }
    if (imagePreview2 && user) {
      //이미지 변경사항이 있는가?
      if (imagePreview2.includes('imagedelivery')) {
        if (prevLost?.lost?.photos[1]?.file) imageIds?.push(prevLost?.lost?.photos[1].file);
      } else {
        if (prevLost?.lost?.photos[1]?.file) {
          //기존 게시물에 파일이 있었다면 삭제 이 칸은 새로운 이미지가 들어왔으니 삭제 필요
          const { success } = await (
            await fetch(`/api/files`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ deleteFileId: prevLost?.lost?.photos[1]?.file }),
            })
          ).json(); //삭제 처리 되었는지 확인 필요
          if (!success) {
            setError('errorMessage', { message: '이미지 수정 중에 문제가 발생했습니다.' });
            return;
          }
        }
        if (image2 && image2.length > 0) {
          const { uploadURL } = await (await fetch(`/api/files`)).json();
          const form = new FormData();
          form.append('file', image2[0], user?.id + '');
          const {
            result: { id },
          } = await (
            await fetch(uploadURL, {
              method: 'POST',
              body: form,
            })
          ).json();
          imageIds?.push(id);
        }
      }
    }
    if (imagePreview3 && user) {
      //이미지 변경사항이 있는가?
      if (imagePreview3.includes('imagedelivery')) {
        if (prevLost?.lost?.photos[2]?.file) imageIds?.push(prevLost?.lost?.photos[2].file);
      } else {
        if (prevLost?.lost?.photos[2]?.file) {
          //기존 게시물에 파일이 있었다면 삭제 이 칸은 새로운 이미지가 들어왔으니 삭제 필요
          const { success } = await (
            await fetch(`/api/files`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ deleteFileId: prevLost?.lost?.photos[2]?.file }),
            })
          ).json(); //삭제 처리 되었는지 확인 필요
          if (!success) {
            setError('errorMessage', { message: '이미지 수정 중에 문제가 발생했습니다.' });
            return;
          }
        }
        if (image3 && image3.length > 0) {
          const { uploadURL } = await (await fetch(`/api/files`)).json();
          const form = new FormData();
          form.append('file', image3[0], user?.id + '');
          const {
            result: { id },
          } = await (await fetch(uploadURL, { method: 'POST', body: form })).json();
          imageIds?.push(id);
        }
      }
    }

    //all 삭제 preview는 비어 있으나 
    if (!imagePreview1 && !imagePreview2 && !imagePreview3) {
      prevLost?.lost?.photos?.forEach(async (photo) => {
        if (photo?.file) {
          
          //실패 시 로직 추가하기
          await (
            await fetch(`/api/files`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ deleteFileId: photo.file }),
            })
          ).json(); //삭제 처리 되었는지 확인 필요
        }
      });
    }
*/
