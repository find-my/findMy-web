import { useState, useEffect } from 'react';

/*
Example
enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
*/
interface Location {
  latitude: number;
  longitude: number;
}
interface Option {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

//현재 위치 단발성 함수
export const useCurrentLocation = (option: Option, trigger: boolean) => {
  // location 정보 저장
  const [location, setLocation] = useState<Location>();
  // 에러 메세지 저장
  const [error, setError] = useState<string>();

  // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }
    console.log(trigger, 1515);
    // Geolocation API 호출
    geolocation.getCurrentPosition(handleSuccess, handleError, option);
  }, [trigger]);

  return { location, error };
};

/*
Example
enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
*/
//위치를 주기적으로 감시

export const useWatchLocation = (option: Option) => {
  // 내 위치 정보 저장
  const [location, setLocation] = useState<Location>();
  // 에러 메세지 저장
  const [error, setError] = useState<string>();
  // watch 인스턴스를 취소할 수 있도록 Geolocation의 `watchPosition`에서 반환된 ID를 저장합니다.
  const [watchPositonId, setWatchPositionId] = useState<number>();
  // Geolocation의 `watchPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    console.log('hahah');
    setLocation({
      latitude,
      longitude,
    });
  };

  // Geolocation의 `watchPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error: GeolocationPositionError) => {
    console.log(error);
    setError(error.toString());
  };
  //
  // 저장된 `watchPosition` ID를 기반으로 감시 인스턴스를 지웁니다.
  const cancelLocationWatch = (id: number) => {
    const { geolocation } = navigator;
    geolocation.clearWatch(id);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    //
    // Geolocation API로 위치 감시 시작
    //반환 값=> 등록한 처리기를 식별할 때 사용하는 정수 ID.

    // React가 사용된 구성 요소를 마운트 해제할 때 위치 감시 인스턴스를 지웁니다.
    const id = geolocation.watchPosition(handleSuccess, handleError, option);
    if (id) {
      setWatchPositionId(id);
    }
  }, [option]);

  return { location, cancelLocationWatch, watchPositonId, error };
};

export default useWatchLocation;
