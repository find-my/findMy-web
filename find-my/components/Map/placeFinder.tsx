import useSWR from 'swr';
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
import React, { useState, useEffect } from 'react';
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
  setLostPlace: (place: string) => void;
  lostPlace: string;
}
interface Imarker {
  position: {
    lat: number;
    lng: number;
  };
  place_name: string;
  road_address_name: string;
}
interface IcategoryPlaceInfoByMap {
  markers: Imarker[];
  bounds: kakao.maps.LatLngBounds;
}
interface IcategoryPlaceInfoByList {
  place_name: string;
  road_address_name: string;
  category_group_name: string;
}

export default function placeFinder({ setOpenFalse, setLostPlace, lostPlace }: Props) {
  const { location, error } = useWatchLocation(geolocationOptions);
  const [placeSearchOn, setPlaceSearchOn] = useState<boolean>(true);
  const [placeKeyword, setPlaceKeyword] = useState<string>();
  const [displayByMap, setDisplayByMap] = useState<boolean>(true);
  const [categoryPlaceInfoByMap, setCategoryPlaceInfoByMap] = useState<IcategoryPlaceInfoByMap>();
  const [categoryPlaceInfoByList, setCategoryPlaceInfoByList] = useState<IcategoryPlaceInfoByList[]>();
  const router = useRouter();
  const placeSearchOnSwitch = () => {
    if (placeSearchOn) return;
    setPlaceSearchOn(true);
  };
  const placeSearchOffSwitch = () => {
    if (!placeSearchOn) return;
    setPlaceSearchOn(false);
  };
  const OnCategorySearch = (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    pagination: kakao.maps.Pagination,
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      const bounds = new kakao.maps.LatLngBounds();
      const resultList = data.map((place: any) => {
        const { place_name, road_address_name, category_group_name } = place;
        return {
          place_name,
          road_address_name,
          category_group_name,
        };
      });
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
      setCategoryPlaceInfoByMap({ markers, bounds });
      setCategoryPlaceInfoByList(resultList);
      console.log(data);
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    }
  };
  const OnKeywordSearch = (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    pagination: kakao.maps.Pagination,
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      const bounds = new kakao.maps.LatLngBounds();
      const resultList = data.map((place: any) => {
        const { place_name, road_address_name, category_group_name } = place;
        return {
          place_name,
          road_address_name,
          category_group_name,
        };
      });
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
      setCategoryPlaceInfoByMap({ markers, bounds });
      setCategoryPlaceInfoByList(resultList);
      console.log(data);
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    }
  };
  const onPlaceSeleted = () => {
    setOpenFalse();
  };
  const onKeywordSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!placeKeyword || !placeKeyword.trim()) return;
    if (!location) return;
    console.log(location);
    const { latitude, longitude } = location;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(placeKeyword, OnKeywordSearch, {
      useMapBounds: true,
      location: new kakao.maps.LatLng(latitude, longitude),
      sort: kakao.maps.services.SortBy.DISTANCE,
    });
  };

  const categorySearch = (code: kakao.maps.services.CategoryGroupCode) => {
    if (!code) return;
    if (!location) return;
    console.log(location);
    const { latitude, longitude } = location;
    const ps = new kakao.maps.services.Places();
    ps.categorySearch(code, OnCategorySearch, {
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
        <SearchMap {...location} categoryPlaceInfo={categoryPlaceInfoByMap} setLostPlace={setLostPlace} />
      ) : (
        <SearchList categoryPlaceInfo={categoryPlaceInfoByList} setLostPlace={setLostPlace} />
      )}
      <div className="fixed bottom-0 flex flex-col w-full h-20 z-10 bg-white divide-y py-1 px-5">
        <div className="flex justify-between items-center py-1">
          <span>🗺️ 선택된 위치</span>
          <button onClick={onPlaceSeleted} className="rounded bg-blue-400 p-1 text-white">
            선택 완료
          </button>
        </div>
        <span>{lostPlace || '선택안됨'}</span>
      </div>
    </div>
  );
}
