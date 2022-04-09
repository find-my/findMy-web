import type { NextPage } from 'next';
import { FieldErrors, useForm, UseFormRegisterReturn } from 'react-hook-form';
import UploadButton from '@components/UploadButton';
import { useCallback, useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import PlaceFinder from 'components/Map/placeFinder';
import useMutation from '@libs/front/hooks/useMutation';
import { Post } from '@prisma/client';
import useUser from '@libs/front/hooks/useUser';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Review } from '@prisma/client';
import useSWR from 'swr';
interface ReviewResponse {
  ok: boolean;
  review: Review;
}
interface ReviewForm {
  review: string;
}

const editReview: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [score, setScore] = useState<number>(1);
  const [eidtReview, { data: editResult, loading }] = useMutation<ReviewResponse>(
    `/api/users/${router.query.id}/reviews/${router.query.reviewId}`,
    'PUT',
  );
  const { data: prevReview } = useSWR<ReviewResponse>(`/api/users/${router.query.id}/reviews/${router.query.reviewId}`);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewForm>();
  useEffect(() => {
    if (prevReview?.review?.review) setValue('review', prevReview?.review?.review);
    if (prevReview?.review?.score) setScore(prevReview?.review?.score);
  }, [prevReview, setValue]);
  useEffect(() => {
    console.log(score);
  }, [score]);
  const onValid = async ({ review }: ReviewForm) => {
    if (loading) return;
    eidtReview({ review, score });
  };
  useEffect(() => {
    if (editResult && editResult.ok) {
      reset();
      setScore(1);
      router.push(`/users/${router.query.id}`);
    }
  }, [editResult]);
  return (
    <>
      {' '}
      <div>
        <form onSubmit={handleSubmit(onValid)} className="px-4 py-16">
          <div className="mt-3">
            <label htmlFor="description">리뷰 수정</label>
            <div className="mt-1">
              <textarea
                {...register('review', { required: true })}
                id="description"
                className="w-full rounded"
                rows={10}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-col space-y-1">
            <span>별점 수정</span>
            <Rating
              onChange={(value) => setScore(value)}
              initialRating={score}
              emptySymbol={<FontAwesomeIcon icon={faStar} className="text-gray-300 mr-1 text-xl" />}
              fullSymbol={<FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />}
            />
          </div>

          <UploadButton isCompleted={errors !== null} />
        </form>
      </div>
    </>
  );
};

export default editReview;
