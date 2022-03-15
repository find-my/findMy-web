// index.html
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/Head';
import type { NextPage } from 'next';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

interface CurPosition {
  latitude: number;
  longitude: number;
}

const Home: NextPage = () => {
  const [curPosition, setCurPosition] = useState<CurPosition>();
  const [error, setError] = useState<string>();
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
};

export default Home;
