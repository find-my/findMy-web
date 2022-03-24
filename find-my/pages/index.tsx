// index.html
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/Head';
import type { NextPage } from 'next';
import { Map, MapMarker, ZoomControl, MapTypeControl, MapProps, MarkerClusterer } from 'react-kakao-maps-sdk';
import useWatchLocation from '../hooks/useWatchLocation';
import Marker from '@components/Marker';
import { markerPositions } from '../db';
import useFetchUser from '@libs/front/hooks/useFetchUser';
interface Position {
  lat: number;
  lng: number;
}
// 컴포넌트 안쪽에서 선언하면 에러 발생
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};
function cls(...classnames: string[]) {
  return classnames.join(' ');
}
const Home: NextPage = () => {
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'skyview'>('roadmap');
  const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [filter, setFilter] = useState<'lost' | 'found' | 'all'>('found');
  const user = useFetchUser();
  console.log('Home');

  const setMapType = (maptype: 'roadmap' | 'skyview') => {
    if (!map) return;

    const roadmapControl = document.getElementById('btnRoadmap');
    const skyviewControl = document.getElementById('btnSkyview');
    if (!roadmapControl || !skyviewControl) return;
    if (maptype === 'roadmap') {
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      roadmapControl.className = 'selected_btn';
      skyviewControl.className = 'btn';
    } else {
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      skyviewControl.className = 'selected_btn';
      roadmapControl.className = 'btn';
    }
    console.log(map?.getMapTypeId());

    setMapStyle(maptype);
  };
  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };
  const zoomOut = () => {
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };

  useEffect(() => {
    if (!location) return;

    console.log(location);
    console.log(error);
  }, [location]);

  return (
    <div>
      <div className="mt-10 relative">
        <Map // 지도를 표시할 Container
          id="map"
          center={{
            // 지도의 중심좌표
            lat: location?.latitude || 37.566535,
            lng: location?.longitude || 126.795841,
          }}
          style={{
            width: '100%',
            height: '90vh',
            position: 'relative',
            overflow: 'hidden',
          }}
          level={3} // 지도의 확대 레벨
          onCreate={setMap}
        >
          <MarkerClusterer
            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel={10} // 클러스터 할 최소 지도 레벨
          >
            {filter !== 'all' ? (
              <>
                {markerPositions
                  .filter((position) => position.type === filter)
                  .map((position) => (
                    <Marker key={`${position.title}-${position.latlng}`} position={position} />
                  ))}
              </>
            ) : (
              <>
                {markerPositions.map((position) => (
                  <Marker key={`${position.title}-${position.latlng}`} position={position} />
                ))}
              </>
            )}
          </MarkerClusterer>
        </Map>
        {/* 지도타입 컨트롤 div 입니다 */}
        <div>
          <div className="flex absolute top-10  left-4 z-10  ">
            <button
              onClick={() => setFilter('lost')}
              className={cls(
                'cursor-pointer p-2 rounded text-center',
                filter === 'lost' ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              분실물
            </button>
            <button
              onClick={() => setFilter('found')}
              className={cls(
                'cursor-pointer p-2 rounded text-center mx-1',
                filter === 'found' ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              습득물
            </button>
            <button
              onClick={() => setFilter('all')}
              className={cls('cursor-pointer p-2 rounded text-center', filter === 'all' ? 'bg-yellow-400' : 'bg-white')}
            >
              모두 보기
            </button>
          </div>
          <div className="custom_typecontrol radius_border absolute top-10  right-4 z-10 bg-white rounded ">
            <button
              id="btnRoadmap"
              className={cls(
                'selected_btn cursor-pointer  rounded-l mr-px p-2',
                mapStyle === 'roadmap' ? 'bg-blue-400' : 'bg-white',
              )}
              onClick={() => setMapType('roadmap')}
            >
              지도
            </button>
            <button
              id="btnSkyview"
              className={cls(
                'btn cursor-pointer bg-white rounded-r p-2',
                mapStyle === 'skyview' ? 'bg-blue-400' : 'bg-white',
              )}
              onClick={() => {
                setMapType('skyview');
              }}
            >
              스카이뷰
            </button>
          </div>
          {/* 지도 확대, 축소 컨트롤 div 입니다 */}
          <div className="custom_zoomcontrol radius_border absolute top-20  right-4 z-10  bg-white w-10 p-2 rounded">
            <span onClick={zoomIn} className="block mb-2 cursor-pointer">
              <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" />
            </span>
            <span onClick={zoomOut} className="cursor-pointer">
              <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
/*


<div className="custom_typecontrol radius_border">
<span id="btnRoadmap" className="selected_btn" onClick={() => setMapType('roadmap')}>
  지도
</span>
<span
  id="btnSkyview"
  className="btn"
  onClick={() => {
    setMapType('skyview');
  }}
>
  스카이뷰
</span>
</div>

<div className="custom_zoomcontrol radius_border">
<span onClick={zoomIn}>
  <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" />
</span>
<span onClick={zoomOut}>
  <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" />
</span>
</div>



*/

/*

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude, Date.now());
        const { latitude, longitude } = position.coords;
        setCurPosition({ latitude, longitude });
      });
    } else {
      console.log('위치 정보 사용 불가능');
      setError('위치 정보 사용 불가능');
    }
  }, []);
  return (
    <Map
      center={{ lat: curPosition?.latitude || 37.566535, lng: curPosition?.longitude || 126.9779692 }}
      style={{ width: '100%', height: '90vh' }}
      level={3}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: '#000' }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
*/
