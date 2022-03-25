import SearchMap from '@components/Map/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrainSubway,
  faCartShopping,
  faStore,
  faUtensils,
  faBed,
  faMugSaucer,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CategoryGroupCode } from 'components/Map/types';
const placeCategory = [
  { name: '지하철', code: CategoryGroupCode.SW8, icon: faTrainSubway },
  { name: '대형마트', code: CategoryGroupCode.MT1, icon: faCartShopping },
  { name: '편의점', code: CategoryGroupCode.CS2, icon: faStore },
  { name: '식당', code: CategoryGroupCode.FD6, icon: faUtensils },
  { name: '숙박', code: CategoryGroupCode.AD5, icon: faBed },
  { name: '카페', code: CategoryGroupCode.CE7, icon: faMugSaucer },
];
export default function placeFinder() {
  const [placeSearchOn, setPlaceSearchOn] = useState<boolean>(true);
  const [placeCategoryCode, setPlaceCategoryCode] = useState<kakao.maps.services.CategoryGroupCode>();
  const placeSearchOnSwitch = () => {
    if (placeSearchOn) return;
    setPlaceSearchOn(true);
  };
  const placeSearchOffSwitch = () => {
    if (!placeSearchOn) return;
    setPlaceSearchOn(false);
  };
  return (
    <div>
      <header className="flex items-center p-2">
        {placeSearchOn ? (
          <button onClick={placeSearchOffSwitch} className="w-8 h-8 text-xl">
            X
          </button>
        ) : null}
        <input onClick={placeSearchOnSwitch} type="text" placeholder="장소 검색" className="w-full h-10 rounded-lg" />
      </header>
      {placeSearchOn ? (
        <div className="w-full flex justify-between py-2 px-10">
          {placeCategory.map((place, index) => (
            <button
              onClick={() => setPlaceCategoryCode(place.code)}
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
      <SearchMap placeCategory={placeCategoryCode} />
    </div>
  );
}
