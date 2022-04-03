//placeFinder.tsx
//키워드 or 카테 고리 검색 실행
// 검색 결과를 SearchMap 과 SearchList 컴포넌트에 넘겨줌
// lost or found place 설정
import SearchMap from '@components/Map/SearchMap';
import useWatchLocation from '../../hooks/useWatchLocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrainSubway,
  faCartShopping,
  faStore,
  faUtensils,
  faBed,
  faMugSaucer,
  faList,
  faMap,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useCallback } from 'react';
import { CategoryGroupCode } from 'components/Map/types';
import SearchList from '@components/Map/SearchList';
import { LOST_PLACE } from '@libs/front/swrKey';
import Router, { useRouter } from 'next/router';
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

const placeCategory = [
  { name: '지하철', code: CategoryGroupCode.SW8, icon: faTrainSubway },
  { name: '대형마트', code: CategoryGroupCode.MT1, icon: faCartShopping },
  { name: '편의점', code: CategoryGroupCode.CS2, icon: faStore },
  { name: '식당', code: CategoryGroupCode.FD6, icon: faUtensils },
  { name: '숙박', code: CategoryGroupCode.AD5, icon: faBed },
  { name: '카페', code: CategoryGroupCode.CE7, icon: faMugSaucer },
];
interface Props {
  setOpenFalse: () => void;
  setLostPlace: (place: ILostPlace) => void;
  lostPlace: ILostPlace;
}

//검색으로 도출된 marker의 interface
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  place_name: string;
  road_address_name: string;
}

//검색 결과를 display 하기 위한 interface for Map
interface IPlaceSearchResultForMap {
  markers: Imarker[];
  bounds: kakao.maps.LatLngBounds;
}
//검색 결과를 display 하기 위한 interface for List
interface IPlaceSearchResultForList {
  place_name: string;
  road_address_name: string;
  category_group_name: string;
  position: {
    lat: number;
    lng: number;
  };
}

//공통으로 사용되는 interface 분리 예정.
interface ILostPlace {
  place: string;
  latitude?: number;
  longitude?: number;
}
export default function placeFinder({ setOpenFalse, setLostPlace, lostPlace }: Props) {
  const { location, error } = useWatchLocation(geolocationOptions); //현재 유저의 위치
  const [placeSearchOn, setPlaceSearchOn] = useState<boolean>(true); //유저가 검색을 할 의도를 갖고 있는지 확인, search 영역이 활성화됨
  const [placeKeyword, setPlaceKeyword] = useState<string>(); //검색 키워드(장소 이름)
  const [displayByMap, setDisplayByMap] = useState<boolean>(true); //검색 결과를 지도상에서 확인 할 것인지 리스트목록으로 볼 것인지 확인
  const [placeSearchResultForMap, setPlaceSearchResultForMap] = useState<IPlaceSearchResultForMap>(); //SearchMap 컴포넌트에 보내질 검색결과
  const [placeSearchResultForList, setPlaceSearchResultForList] = useState<IPlaceSearchResultForList[]>(); //SearchList 컴포넌트에 보내질 검색 결과
  const router = useRouter();

  //검색 영역이 활성화됨
  const placeSearchOnSwitch = useCallback(() => {
    if (placeSearchOn) return;
    setPlaceSearchOn(true);
  }, []);
  //검색 영역이 비활성화됨
  const placeSearchOffSwitch = useCallback(() => {
    if (!placeSearchOn) return;
    setPlaceSearchOn(false);
  }, []);
  //place가 결정되면 upload로 돌아감.
  const onPlaceSeleted = () => {
    setOpenFalse();
  };
  //keyword,category검색 함수 콜백함수
  const OnSearch = (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    pagination: kakao.maps.Pagination,
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      //bounds와 markers는 setSearchResultForMap에 들어갈 값들.
      const bounds = new kakao.maps.LatLngBounds();
      const markers = data.map((place: any) => {
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
          place_name: place.place_name,
          road_address_name: place.road_address_name,
        };
      });
      //결과 목록. setSearchResultForList에 들어갈 값.
      const resultList = data.map((place: any) => {
        console.log(place);
        const { place_name, road_address_name, category_group_name, x, y } = place;
        return {
          place_name,
          road_address_name,
          category_group_name,
          position: {
            lat: place.y,
            lng: place.x,
          },
        };
      });

      setPlaceSearchResultForMap({ markers, bounds });
      setPlaceSearchResultForList(resultList);
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    }
  };

  //검색 키워드가 입력 되면 키워드 검색 함수가 실행됨.
  const onKeywordSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!placeKeyword || !placeKeyword.trim()) return;
    if (!location) return;
    console.log(location);
    const { latitude, longitude } = location; //현재 사용자 위치 좌표.
    const ps = new kakao.maps.services.Places();
    //키워드 검색 함수
    ps.keywordSearch(placeKeyword, OnSearch, {
      //키워드 검색 옵션들. 현재 위치를 기준으로 거리순으로 15개 목록이 불러와짐.
      useMapBounds: true,
      location: new kakao.maps.LatLng(latitude, longitude),
      sort: kakao.maps.services.SortBy.DISTANCE,
    });
  };

  //카테고리별 검색, 지하철,대형마트,편의점,식당,숙박,카페 중에서 선택할 수 있음.
  const categorySearch = (code: kakao.maps.services.CategoryGroupCode) => {
    if (!code) return;
    if (!location) return;
    console.log(location);
    const { latitude, longitude } = location; //현재 사용자의 위치
    const ps = new kakao.maps.services.Places();
    ps.categorySearch(code, OnSearch, {
      //현재 위치를 기준으로 거리순으로 15개 항목을 불러오게 설정
      useMapBounds: true,
      location: new kakao.maps.LatLng(latitude, longitude),
      sort: kakao.maps.services.SortBy.DISTANCE,
    });
  };

  //mt-10

  return (
    <div>
      <div className="fixed top-0 z-10 w-full bg-white">
        <header className=" flex items-center p-2">
          {placeSearchOn ? (
            <button
              onClick={() => setDisplayByMap((prev) => !prev)}
              className="h-8 w-16 flex justify-center space-x-1 items-center whitespace-nowrap text-sm bg-blue-400 text-white rounded"
            >
              {displayByMap ? (
                <>
                  <FontAwesomeIcon icon={faList} />
                  <span>목록</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMap} />
                  <span>지도</span>
                </>
              )}
            </button>
          ) : null}
          {placeSearchOn ? (
            <button onClick={placeSearchOffSwitch} className="w-8 h-8 text-xl">
              X
            </button>
          ) : null}
          <form onSubmit={onKeywordSubmit} className="w-full">
            <input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPlaceKeyword(event.currentTarget.value)}
              value={placeKeyword}
              onClick={placeSearchOnSwitch}
              type="text"
              placeholder="장소 검색"
              className="w-full h-10 rounded-lg"
            />
          </form>
        </header>
        {placeSearchOn ? (
          <div className="w-full flex justify-between py-2 px-10">
            {placeCategory.map((place, index) => (
              <button
                onClick={() => categorySearch(place.code)}
                key={index}
                className="flex flex-col items-center space-y-1"
              >
                <span>
                  <FontAwesomeIcon icon={place.icon} />
                </span>
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {displayByMap ? (
        <SearchMap {...location} placeInfo={placeSearchResultForMap} setLostPlace={setLostPlace} />
      ) : (
        <SearchList placeInfo={placeSearchResultForList} setLostPlace={setLostPlace} />
      )}
      <div className="fixed bottom-0 flex flex-col w-full h-20 z-10 bg-white divide-y py-1 px-5">
        <div className="flex justify-between items-center py-1">
          <span>🗺️ 선택된 위치</span>
          <button onClick={onPlaceSeleted} className="rounded bg-blue-400 p-1 text-white">
            선택 완료
          </button>
        </div>
        <span>{lostPlace.place || '선택안됨'}</span>
      </div>
    </div>
  );
}
