import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { LOST_PLACE } from '@libs/front/swrKey';
interface IPlaceSearchResultForList {
  place_name: string;
  road_address_name: string;
  category_group_name: string;
  position: {
    lat: number;
    lng: number;
  };
}

interface Props {
  placeInfo?: IPlaceSearchResultForList[];
  setLostPlace: (place: ILostPlace) => void;
}
interface ILostPlace {
  place: string;
  latitude?: number;
  longitude?: number;
}
function SearchList({ placeInfo, setLostPlace }: Props) {
  // const { mutate: lostPlaceMutate } = useSWR<string>(LOST_PLACE);

  return (
    <>
      {placeInfo ? (
        <div className="flex flex-col space-y-5  py-2  border-t-2">
          {placeInfo.map((info, i) => {
            const {
              place_name,
              road_address_name,
              category_group_name,
              position: { lat, lng },
            } = info;
            return (
              <div
                onClick={() =>
                  setLostPlace({ place: `${place_name}/${road_address_name}`, latitude: lat, longitude: lng })
                }
                key={i}
                className="flex border-b pb-4 cursor-pointer justify-between items-end px-4"
              >
                <div className="flex flex-col justify-between">
                  <h3 className="text-lg font-semibold">{place_name}</h3>
                  <div className="flex flex-col">
                    <span className="text-base font-medium ">{road_address_name}</span>
                    <span className="text-xs font-medium text-slate-500">{category_group_name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

export default React.memo(SearchList);
