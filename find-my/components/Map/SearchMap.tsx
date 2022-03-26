// index.html
import React, { useEffect, useState } from 'react';
import { classNames } from '@libs/front/utils';
import { Map, MarkerClusterer, MapMarker } from 'react-kakao-maps-sdk';
import useWatchLocation from '../../hooks/useWatchLocation';
import Marker from '@components/Map/Marker';
import { markerPositions } from '../../db';
import useSWR, { useSWRConfig } from 'swr';
import { LOST_PLACE } from '@libs/front/swrKey';
interface Props {
  latitude?: number;
  longitude?: number;

  categoryPlaceInfo?: { markers: Imarker[]; bounds: kakao.maps.LatLngBounds };
}
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  place_name: string;
  road_address_name: string;
}

function Search({ latitude, longitude, categoryPlaceInfo }: Props) {
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'skyview'>('roadmap');
  const [map, setMap] = useState<kakao.maps.Map>();
  const { mutate } = useSWRConfig();
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
    if (!map || !categoryPlaceInfo) return;
    console.log('바운드세팅');
    map.setBounds(categoryPlaceInfo.bounds);
  }, [map, categoryPlaceInfo]);
  return (
    <div className="mt-20">
      <div className="relative ">
        <Map // 지도를 표시할 Container
          id="map"
          center={{
            // 지도의 중심좌표
            lat: latitude || 37.566535,
            lng: longitude || 126.795841,
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
          {categoryPlaceInfo &&
            categoryPlaceInfo.markers?.map((marker) => (
              <MapMarker
                key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => {
                  mutate(LOST_PLACE, `${marker.place_name}/${marker.road_address_name}`);
                }}
              ></MapMarker>
            ))}
        </Map>
        {/* 지도타입 컨트롤 div 입니다 */}
        <div>
          <div className="custom_typecontrol radius_border absolute top-10  right-4 z-10 bg-white rounded ">
            <button
              id="btnRoadmap"
              className={classNames(
                'selected_btn cursor-pointer  rounded-l mr-px p-2',
                mapStyle === 'roadmap' ? 'bg-blue-400' : 'bg-white',
              )}
              onClick={() => setMapType('roadmap')}
            >
              지도
            </button>
            <button
              id="btnSkyview"
              className={classNames(
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
}

export default React.memo(Search);
