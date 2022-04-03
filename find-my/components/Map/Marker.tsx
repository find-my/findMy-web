import { useEffect, useState } from 'react';
import { Map, MapMarker, ZoomControl, MapTypeControl, MapProps } from 'react-kakao-maps-sdk';
import { ExtendedLost } from '../../typeDefs/lost';
interface Props {
  item: ExtendedLost;
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
          {isOpen && (
            <div style={{ minWidth: '150px' }}>
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
                onClick={() => setIsOpen(false)}
              />
              <div style={{ padding: '5px', color: '#000' }}>{item.category}</div>
            </div>
          )}
        </MapMarker>
      ) : null}
    </>
  );
}

export default Marker;
