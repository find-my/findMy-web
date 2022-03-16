import { useEffect } from 'react';
import { Map, MapMarker, ZoomControl, MapTypeControl, MapProps } from 'react-kakao-maps-sdk';

interface Props {
  position: {
    title: string;
    type: string;
    latlng: {
      lat: number;
      lng: number;
    };
  };
}

function Marker({ position }: Props) {
  return (
    <MapMarker
      position={{ lat: position.latlng.lat, lng: position.latlng.lng }}
      image={{
        src: `/images/marker_${position.type === 'lost' ? 'red' : 'blue'}.svg`, // 마커이미지의 주소입니다
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
    >
      <div style={{ opacity: 0 }}>
        <div className="rounded text-center w-40 h-14 bg-red-100">{position.title}</div>
      </div>
    </MapMarker>
  );
}

export default Marker;
