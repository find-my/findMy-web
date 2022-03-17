function LostList() {
  return (
    <div className="flex flex-col space-y-5  py-10">
      {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <div key={i} className="flex border-b pb-4 cursor-pointer justify-between items-end px-4">
          <div className="flex space-x-4">
            <div className="w-20 h-20 rounded bg-slate-500" />
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">New iPhone 14</h3>

                <span className="text-base font-medium ">영통역</span>
              </div>
              <div className="flex items-end text-xs font-medium text-slate-500">
                <span className="text-xs font-medium">15분전</span> <span> ㅣ </span>{' '}
                <span className="text-xs font-medium">오니</span>
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
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
          </div>
        </div>
      ))}
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

export default LostList;
