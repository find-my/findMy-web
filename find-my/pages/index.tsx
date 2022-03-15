// index.html
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/Head';
import type { NextPage } from 'next';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useWatchLocation from '../hooks/useWatchLocation';
interface CurPosition {
  latitude: number;
  longitude: number;
}

// 컴포넌트 안쪽에서 선언하면 에러 발생
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

const Home: NextPage = () => {
  const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);

  useEffect(() => {
    if (!location) return;
    console.log(location);
  }, []);

  return (
    <Map
      center={{ lat: location?.latitude || 37.566535, lng: location?.longitude || 126.9779692 }}
      style={{ width: '100%', height: '90vh' }}
      level={3}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: '#000' }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
};

export default Home;

/*

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude, Date.now());
        const { latitude, longitude } = position.coords;
        setCurPosition({ latitude, longitude });
      });
    } else {
      console.log('위치 정보 사용 불가능');
      setError('위치 정보 사용 불가능');
    }
  }, []);
  return (
    <Map
      center={{ lat: curPosition?.latitude || 37.566535, lng: curPosition?.longitude || 126.9779692 }}
      style={{ width: '100%', height: '90vh' }}
      level={3}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: '#000' }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
*/
