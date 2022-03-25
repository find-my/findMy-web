// index.html
import React, { useEffect, useState } from 'react';
import { classNames } from '@libs/front/utils';
import { Map, MarkerClusterer, MapMarker } from 'react-kakao-maps-sdk';
import useWatchLocation from '../../hooks/useWatchLocation';
import Marker from '@components/Map/Marker';
import { markerPositions } from '../../db';

interface Props {
  placeCategory?: kakao.maps.services.CategoryGroupCode;
}
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

// 컴포넌트 안쪽에서 선언하면 에러 발생
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

function Search({ placeCategory }: Props) {
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'skyview'>('roadmap');
  const { location, error } = useWatchLocation(geolocationOptions);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [info, setInfo] = useState<Imarker>();
  const [markers, setMarkers] = useState<Imarker[]>();

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
  const OnCategorySearch = (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    pagination: kakao.maps.Pagination,
  ) => {
    if (!map) return;
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      const bounds = new kakao.maps.LatLngBounds();

      const markerArr = data.map((place: any) => {
        console.log({
          position: {
            lat: place.y,
            lng: place.x,
          },
          content: place.place_name,
        });
        bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        return {
          position: {
            lat: place.y,
            lng: place.x,
          },
          content: place.place_name,
        };
      });
      setMarkers(markerArr);
      console.log(data);
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }
  };
  useEffect(() => {
    if (!location) return;

    console.log(location);
    console.log(error);
  }, [location]);

  useEffect(() => {
    if (!map) return;
    if (!placeCategory) return;
    const { latitude, longitude } = location;
    const ps = new kakao.maps.services.Places();
    ps.categorySearch(placeCategory, OnCategorySearch, {
      useMapBounds: true,
      location: new kakao.maps.LatLng(latitude, longitude),
      sort: kakao.maps.services.SortBy.DISTANCE,
    });
  }, [map, placeCategory]);
  //mt-10
  useEffect(() => {
    console.log(markers, 'MARKES');
  }, [markers]);
  //console.log(markers, 'MARKES');
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
          level={5} // 지도의 확대 레벨
          onCreate={setMap}
        >
          {markers &&
            markers?.map((marker) => (
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => setInfo(marker)}
              >
                {info && info.content === marker.content && <div style={{ color: '#000' }}>{marker.content}</div>}
              </MapMarker>
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

export default Search;
