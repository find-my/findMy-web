//Map.tsx
//홈 화면에서 post/found 목록을 띄움
//post /found 는 빨강/파랑 색으로 구분됨
import React, { useCallback, useEffect, useState } from 'react';
import { classNames } from '@libs/front/utils';
import { Map, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useWatchLocation, useCurrentLocation } from '@libs/front/location';
import Marker from '@components/Map/Marker';
import useSWR from 'swr';
import { PostListResponse } from '../../typeDefs/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { PostType } from '@prisma/client';
// 컴포넌트 안쪽에서 선언하면 에러 발생
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

function MapContainer() {
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'skyview'>('roadmap');
  const { location, watchPositonId, cancelLocationWatch } = useWatchLocation(geolocationOptions);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [filter, setFilter] = useState<'lost' | 'found' | 'all'>('found');
  const { data: postListData } = useSWR<PostListResponse>('/api/posts');
  const panTo = useCallback(() => {
    // 이동할 위도 경도 위치를 생성합니다
    if (!map || !location) return;
    var moveLatLon = new kakao.maps.LatLng(location?.latitude, location?.longitude);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  }, [location, map]);
  const SetMapTypeToRoadMap = () => {
    setMapType('roadmap');
  };
  const SetMapTypeToSkyView = () => {
    setMapType('skyview');
  };
  console.log(postListData);
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
    if (watchPositonId === undefined) return;
    return cancelLocationWatch(watchPositonId);
  }, [watchPositonId]);

  //mt-10
  return (
    <div>
      <div className="relative">
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
            {filter === 'all' ? (
              <>
                {postListData?.postList?.map((post) => (
                  <Marker key={post.id} item={post} />
                ))}
              </>
            ) : (
              <>
                {filter === 'lost' ? (
                  <>
                    {postListData?.postList
                      ?.filter((post) => post.type === PostType.LOST)
                      ?.map((post) => (
                        <Marker key={post.id} item={post} />
                      ))}
                  </>
                ) : (
                  <>
                    {postListData?.postList
                      ?.filter((post) => post.type === PostType.FOUND)
                      ?.map((post) => (
                        <Marker key={post.id} item={post} />
                      ))}
                  </>
                )}
              </>
            )}
          </MarkerClusterer>
        </Map>
        {/* 지도타입 컨트롤 div 입니다 */}
        <div>
          <div className="flex absolute top-10  left-4 z-10  ">
            <button
              onClick={() => setFilter('lost')}
              className={classNames(
                'cursor-pointer p-2 rounded text-center',
                filter === 'lost' ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              분실물
            </button>
            <button
              onClick={() => setFilter('found')}
              className={classNames(
                'cursor-pointer p-2 rounded text-center mx-1',
                filter === 'found' ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              습득물
            </button>
            <button
              onClick={() => setFilter('all')}
              className={classNames(
                'cursor-pointer p-2 rounded text-center',
                filter === 'all' ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              모두 보기
            </button>
          </div>
          <div className="custom_typecontrol radius_border absolute top-10  right-4 z-10 bg-white rounded ">
            <button
              id="btnRoadmap"
              className={classNames(
                'selected_btn cursor-pointer  rounded-l mr-px p-2',
                mapStyle === 'roadmap' ? 'bg-blue-400' : 'bg-white',
              )}
              onClick={SetMapTypeToRoadMap}
            >
              지도
            </button>
            <button
              id="btnSkyview"
              className={classNames(
                'btn cursor-pointer bg-white rounded-r p-2',
                mapStyle === 'skyview' ? 'bg-blue-400' : 'bg-white',
              )}
              onClick={SetMapTypeToSkyView}
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
          <button onClick={panTo} className="absolute top-40 right-4 z-10 bg-white rounded p-2">
            <FontAwesomeIcon icon={faLocationCrosshairs} size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapContainer;
/*
 <Controller
            mapStyle={mapStyle}
            SetMapTypeToRoadMap={SetMapTypeToRoadMap}
            SetMapTypeToSkyView={SetMapTypeToSkyView}
            panTo={panTo}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
          />
*/
interface TempProps {
  mapStyle: 'roadmap' | 'skyview';
  SetMapTypeToRoadMap: () => void;
  SetMapTypeToSkyView: () => void;
  panTo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}
function Controller({ mapStyle, SetMapTypeToRoadMap, SetMapTypeToSkyView, panTo, zoomIn, zoomOut }: TempProps) {
  return (
    <>
      <div className="custom_typecontrol radius_border absolute top-10  right-4 z-10 bg-white rounded ">
        <button
          id="btnRoadmap"
          className={classNames(
            'selected_btn cursor-pointer  rounded-l mr-px p-2',
            mapStyle === 'roadmap' ? 'bg-blue-400' : 'bg-white',
          )}
          onClick={SetMapTypeToRoadMap}
        >
          지도
        </button>
        <button
          id="btnSkyview"
          className={classNames(
            'btn cursor-pointer bg-white rounded-r p-2',
            mapStyle === 'skyview' ? 'bg-blue-400' : 'bg-white',
          )}
          onClick={SetMapTypeToSkyView}
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
      <button onClick={panTo} className="absolute top-40 right-4 z-10 bg-white rounded p-2">
        <FontAwesomeIcon icon={faLocationCrosshairs} size="lg" />
      </button>
    </>
  );
}
