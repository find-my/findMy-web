import type { UseFormRegisterReturn } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
interface Props {
  placeholder: string;
  register: UseFormRegisterReturn;
}
function MessageInput({ register, placeholder }: Props) {
  const resizeHeight = (event: React.KeyboardEvent) => {
    console.log(event);
    //event.currentTarget.scrollHeight
  };
  return (
    <div>
      <div className="shadow fixed left-0 p-2 bottom-0 flex w-full justify-center items-center bg-gray-200">
        <div className="text-gray-500 cursor-pointer">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        {
          //글자 긴거 줄 바꿈 처리되게 바꾸기
        }
        <TextareaAutosize {...register} className="rounded-2xl  w-3/4 mx-4" placeholder={placeholder} />
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
    </div>
  );
}

export default MessageInput;
