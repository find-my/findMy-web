import { Lost, User } from '@prisma/client';
interface Props {
  contents: LostListResponse;
}
interface ExtendedLost extends Lost {
  user: User;
  _count: {
    scraps: number;
  };
}
interface LostListResponse {
  ok: boolean;
  lostList: ExtendedLost[];
}
function GetLostResult({ contents }: Props) {
  function displayedAt(createdAt: string) {
    if (!createdAt) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    const createdArr = createdAt.split('-');
    const createdY = createdArr[0];
    const createdM = createdArr[1];
    const createdD = createdArr[2].split('T')[0];
    const createdH = createdArr[2].split('T')[1].split(':')[0];
    const createdMin = createdArr[2].split('T')[1].split(':')[1];
    //createdAt.getTime();

    const YMDH_SAME = year === +createdY && month === +createdM && day === +createdM && hour === +createdH;
    const YMD_SAME = year === +createdY && month === +createdM && day === +createdM;
    const Y_SAME = year === +createdY;
    if (YMDH_SAME) {
      const diff = minutes - +createdMin;
      if (diff === 0) return '방금전';
      return `${diff}분전`;
    } else if (YMD_SAME) {
      return `${hour - +createdH}시간전`;
    } else if (Y_SAME) {
      return `${createdM}/${createdD}`;
    }
    return `${createdY}/${createdM}/${createdD}`;
  }

  return (
    <div className="flex flex-col space-y-5  py-10">
      {contents?.lostList.map((lost: any, i: number) => {
        const {
          title,
          lostPlace,
          createdAt,
          user: { name },
        } = lost;
        const ago = displayedAt(createdAt.toString());
        return (
          <div key={i} className="flex border-b pb-4 cursor-pointer justify-between items-end px-4">
            <div className="flex space-x-4">
              <div className="w-20 h-20 rounded bg-slate-500" />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>

                  <span className="text-base font-medium ">{lostPlace}</span>
                </div>
                <div className="flex items-end text-xs font-medium text-slate-500">
                  <span className="text-xs font-medium">{ago}</span> <span> ㅣ </span>{' '}
                  <span className="text-xs font-medium">{name}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 text-slate-500 ">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>1</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>1</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
                <span>{lost._count.scraps}</span>
              </div>
            </div>
          </div>
        );
      })}
      <button className="fixed bottom-16 right-2 hover:bg-blue-500 transition-colors p-2 text-white bg-blue-400 rounded-full">
        <svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

export default GetLostResult;
