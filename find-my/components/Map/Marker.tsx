import { useEffect, useState } from 'react';
import { Map, MapMarker, ZoomControl, MapTypeControl, MapProps } from 'react-kakao-maps-sdk';
import { ExtendedPost } from '../../typeDefs/post';
interface Props {
  item: ExtendedPost;
  itemType: 'lost' | 'found';
}

function Marker({ item, itemType }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {item.latitude && item.longitude ? (
        <MapMarker
          position={{ lat: item.latitude, lng: item.longitude }}
          image={{
            src: `/images/marker_${itemType === 'lost' ? 'red' : 'blue'}.svg`, // 마커이미지의 주소입니다
            size: {
              width: 60,
              height: 29,
            }, // 마커이미지의 크기입니다
            options: {
              offset: {
                x: 27,
                y: 69,
              }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            },
          }}
          onClick={() => setIsOpen(true)}
        >
          {isOpen && <Content item={item} closeWindow={() => setIsOpen(false)} />}
        </MapMarker>
      ) : null}
    </>
  );
}

export default Marker;
interface ContentProps {
  item: ExtendedPost;
  closeWindow: () => void;
}
function Content({ item, closeWindow }: ContentProps) {
  console.log(item);
  return (
    <div className="bg-white p-2 relative flex flex-col w-56 h-56 items-center">
      <button onClick={closeWindow} className="absolute z-1000 top-1 right-1">
        <svg
          className="w-6 h-6"
          fill="white"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>
      <div>
        {item.photos && item.photos[0]?.file ? (
          <img
            src={`https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${item.photos[0]?.file}/public`}
            className="w-20 h-20 rounded "
          />
        ) : (
          <div className="w-20 h-20 rounded bg-slate-500" />
        )}
      </div>
      <div className="flex flex-col w-full overflow-x-clip space-y-2 ">
        <span className="text-sm text-blue-400 mt-2 text-center font-semibold">자세히 보기&rarr;</span>
        <span className="text-base font-semibold ">{item.title}</span>
        <span className="text-base">카테고리: {item.category}</span>
        <span className="text-sm">{item.createdAt}</span>
      </div>
    </div>
  );
}
/*


 <img
                alt="close"
                width="14"
                height="13"
                src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                  cursor: 'pointer',
                }}
               
              />

*/
