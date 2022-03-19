import type { NextPage } from 'next';
const ChatDetail: NextPage = () => {
  return (
    <div className="px-4 py-10 space-y-8">
      <div className="flex  space-x-2  ">
        <div className="w-12 h-12 rounded-full bg-slate-500" />
        <div className="">
          <p className=" block text-black mb-1">살찐감자</p>

          <div className="flex items-end space-x-1 ">
            <p className="block text-sm text-gray-900 bg-blue-200 p-2 rounded w-2/3">
              지갑 근처 경찰서에 맡겨 두었습니다.
            </p>
            <span className="block  text-sm  text-gray-500 whitespace-nowrap">오후 1:12</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row-reverse items-end space-x-1 space-x-reverse">
        <p className="text-sm text-gray-900 bg-yellow-200 p-2 rounded w-2/3">
          네 감사합니다ㅠㅠ 사례로 스타벅스 기프티콘 드리겠습니다.
        </p>
        <span className="text-sm  text-gray-500 whitespace-nowrap">오후 1:15</span>
      </div>

      <div className="flex  space-x-2 w-2/3">
        <div className="w-12 h-12 rounded-full bg-slate-500" />
        <div className="">
          <p className=" block text-black mb-1">살찐감자</p>

          <div className="flex items-end space-x-1">
            <p className="block text-sm text-gray-900 bg-blue-200 p-2 rounded w-2/3">어 너무 좋죠😊</p>
            <span className="block  text-sm  text-gray-500 whitespace-nowrap">오후 3:13</span>
          </div>
        </div>
      </div>

      <div>
        <div className="shadow fixed left-0 p-2 bottom-0 flex w-full justify-center items-center bg-gray-200">
          <button className="text-gray-500 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
          <input className="rounded-2xl h-10 w-3/4 mx-4" type="text" />
          <button className="rotate-90 text-gray-400 hover:text-blue-400 cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
