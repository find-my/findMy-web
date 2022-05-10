// SearchMap.tsx
// 지도 상에서 클릭한 위치로 lost/found place 설정
// 키워드/카테고리 검색 결과 display
// 검색 결과를 기반으로 lost/found place 설정
import React, { useEffect, useState, useCallback } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
interface Props {
  latitude?: number;
  longitude?: number;
  placeKeyword?: string;
  placeInfo?: { markers: Imarker[]; bounds: kakao.maps.LatLngBounds };
  setPostPlace: (place: IPostPlace) => void;
}
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  place_name: string;
  road_address_name: string;
}
interface IPostPlace {
  place: string;
  latitude?: number;
  longitude?: number;
}
function Search({ latitude, longitude, placeInfo, placeKeyword, setPostPlace }: Props) {
  const [map, setMap] = useState<kakao.maps.Map>(); //지도
  const [pointMarker, setPointMarker] = useState<kakao.maps.Marker>(); //지도 상에서 클릭한 위치에 생성될 마커
  const panTo = useCallback(() => {
    // 이동할 위도 경도 위치를 생성합니다
    if (!map || !latitude || !longitude) return;
    var moveLatLon = new kakao.maps.LatLng(latitude, longitude);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  }, [location, map]);
  //지도 줌인
  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };
  //지도 줌 아웃
  const zoomOut = () => {
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };
  //좌료를 주소로 변환
  function searchDetailAddrFromCoords(coords: any, callback: any) {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  //지도 상에서 클릭한 위치를 도로명 주소로 변환 함. 그리도 클릭한 위치위에 마커 생성
  const onMapClick = (target: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (!pointMarker) return;
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result: any, status: any) {
      if (!mouseEvent.latLng) return;
      if (!map) return;
      if (status === kakao.maps.services.Status.OK) {
        // 클릭한 위치를 표시할 마커입니다
        // 마커를 클릭한 위치에 표시합니다
        pointMarker.setPosition(mouseEvent.latLng);
        pointMarker.setMap(map);
        console.log(mouseEvent.latLng);
        setPostPlace({
          place: result[0].address.address_name,
          latitude: mouseEvent.latLng.getLat(),
          longitude: mouseEvent.latLng.getLng(),
        });
      }
    });
  };

  //임의의 좌표로 마커를 생성해둠
  useEffect(() => {
    window.kakao.maps.load(() => {
      setPointMarker(new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.566535, 126.795841) }));
    });
  }, []);
  useEffect(() => {
    if (!map || !placeInfo) return;

    //바운드 세팅
    map.setBounds(placeInfo.bounds);
  }, [placeInfo]);
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
          {placeInfo &&
            placeInfo.markers?.map((marker) => (
              <MapMarker
                key={`marker-${marker.place_name}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => {
                  setPostPlace({
                    place: `${marker.place_name}/${marker.road_address_name}`,
                    latitude: marker.position.lat,
                    longitude: marker.position.lng,
                  });
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
          <button onClick={panTo} className="absolute top-40 right-4 z-10 bg-white rounded p-2">
            <FontAwesomeIcon icon={faLocationCrosshairs} size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Search);
