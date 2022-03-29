//any 고치기
import { useState, useEffect, useRef } from 'react';

interface Option {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}
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
const useWatchLocation = (option: Option) => {
  // 내 위치 정보 저장
  const [location, setLocation] = useState<Location>();
  // 에러 메세지 저장
  const [error, setError] = useState<string>();
  // watch 인스턴스를 취소할 수 있도록 Geolocation의 `watchPosition`에서 반환된 ID를 저장합니다.

  // Geolocation의 `watchPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (pos: any) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Geolocation의 `watchPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error: any) => {
    console.log(error.message);
    setError(error.message);
  };
  //
  // 저장된 `watchPosition` ID를 기반으로 감시 인스턴스를 지웁니다.
  const cancelLocationWatch = (watchPositonId: number) => {
    const { geolocation } = navigator;
    geolocation.clearWatch(watchPositonId);
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
    const watchPositonId = navigator.geolocation.watchPosition(handleSuccess, handleError, option);
  }, [option]);

  return { location, cancelLocationWatch, error };
};

export default useWatchLocation;
