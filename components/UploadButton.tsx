import { classNames } from '@libs/front/utils';
interface Props {
  isCompleted: boolean;
}
export default function UploadButton({ isCompleted }: Props) {
  return (
    <button
      className={classNames('mt-4 rounded text-white w-full h-10', `${isCompleted ? 'bg-blue-400' : 'bg-blue-300'}`)}
    >
      업로드
    </button>
  );
}
