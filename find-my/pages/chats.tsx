import type { NextPage } from 'next';

const Chats: NextPage = () => {
  return (
    <div className="py-10 divide-y-[1px] ">
      {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <div key={i} className="flex items-end px-5 cursor-pointer py-3 justify-between">
          <div className="flex space-x-2 ">
            <div className="w-12 h-12 rounded-full bg-slate-500" />
            <div>
              <p className="text-black mb-1">살찐감자</p>
              <p className="text-sm  text-gray-500">지갑 근처 경찰서에 맡겨 두었습니다.</p>
            </div>
          </div>
          <div className="flex flex-col items-end ">
            <div className="mb-1 text-sm  text-gray-500">오후 1:12</div>
            <div className="text-white text-sm bg-red-500 rounded-full w-5 h-5 text-center">1</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
