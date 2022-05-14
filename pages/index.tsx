// index.html
import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import Map from '@components/Map';
import useSWR, { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import useUser from '@libs/front/hooks/useUser';
import { withSsrSession } from '@libs/back/session';
import client from '@libs/back/client';
import Layout from '@components/layout';
export const getServerSideProps = withSsrSession(async function ({ req, res }: NextPageContext) {
  const user = req?.session?.user;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});
const Home: NextPage = ({ user }: any) => {
  console.log(JSON.parse(JSON.stringify(user)));
  return (
    <Layout logoDisplay={true}>
      <Map />
    </Layout>
  );
};

export default Home;
/*


<div className="custom_typecontrol radius_border">
<span id="btnRoadmap" className="selected_btn" onClick={() => setMapType('roadmap')}>
  지도
</span>
<span
  id="btnSkyview"
  className="btn"
  onClick={() => {
    setMapType('skyview');
  }}
>
  스카이뷰
</span>
</div>

<div className="custom_zoomcontrol radius_border">
<span onClick={zoomIn}>
  <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" />
</span>
<span onClick={zoomOut}>
  <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" />
</span>
</div>



*/

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
