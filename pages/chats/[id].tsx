import type { NextPage } from 'next';
import MessageInput from '@components/MessageInput';
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
      {
        //<MessageInput register={} placeholder="메시지를 입력하세요." />
      }
    </div>
  );
};

export default ChatDetail;
