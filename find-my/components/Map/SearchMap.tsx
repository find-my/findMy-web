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
  placeKeyword?: string;
  categoryPlaceInfo?: { markers: Imarker[]; bounds: kakao.maps.LatLngBounds };
  setLostPlace: (place: string) => void;
}
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  place_name: string;
  road_address_name: string;
}

function Search({ latitude, longitude, categoryPlaceInfo, placeKeyword, setLostPlace }: Props) {
  const [map, setMap] = useState<kakao.maps.Map>();
  // const { mutate: lostPlaceMutate } = useSWR<string>(LOST_PLACE);
  const [pointMarker, setPointMarker] = useState<kakao.maps.Marker>();

  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };
  const zoomOut = () => {
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };
  function searchDetailAddrFromCoords(coords: any, callback: any) {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  const onMapClick = (target: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (!pointMarker) return;
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result: any, status: any) {
      if (!mouseEvent.latLng) return;
      if (!map) return;
      if (status === kakao.maps.services.Status.OK) {
        console.log(result[0].address.address_name);
        console.log(mouseEvent?.latLng?.getLat());
        // 클릭한 위치를 표시할 마커입니다
        //const = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다
        // 마커를 클릭한 위치에 표시합니다
        pointMarker.setPosition(mouseEvent.latLng);
        pointMarker.setMap(map);
        console.log(mouseEvent.latLng);
        setLostPlace(result[0].address.address_name);
        // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
        //infowindow.setContent(content);
        //infowindow.open(map, marker);
      }
    });
  };
  useEffect(() => {
    window.kakao.maps.load(() => {
      setPointMarker(new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.566535, 126.795841) }));
    });
  }, []);
  useEffect(() => {
    if (!map || !categoryPlaceInfo) return;

    console.log('바운드세팅');
    map.setBounds(categoryPlaceInfo.bounds);
  }, [categoryPlaceInfo]);
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
          onClick={onMapClick}
        >
          {categoryPlaceInfo &&
            categoryPlaceInfo.markers?.map((marker) => (
              <MapMarker
                key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => {
                  setLostPlace(`${marker.place_name}/${marker.road_address_name}`);
                }}
              ></MapMarker>
            ))}
        </Map>
        {/* 지도타입 컨트롤 div 입니다 */}
        <div>
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
