import type { UseFormRegisterReturn } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
interface Props {
  placeholder: string;
  register: UseFormRegisterReturn;
}

function SquareMessageInput({ register, placeholder }: Props) {
  return (
    <div className="flex items-end">
      <TextareaAutosize {...register} placeholder="대댓글 입력" className="rounded  w-3/4 mx-4 " />
      <label>
        <input type="submit" className="hidden" />

        <svg
          className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer rotate-90"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
        </svg>
      </label>
    </div>
  );
}
export default SquareMessageInput;
