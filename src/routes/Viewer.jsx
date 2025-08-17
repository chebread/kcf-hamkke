import loadGroup from 'components/loadGroup';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import NotFoundPage from 'routes/NotFoundPage';
import Maps from 'routes/Maps';
import styled from 'styled-components';
import deleteGroup from 'components/deleteGroup';
import { Layer, Marker, Source, useMap } from 'react-map-gl';
import useGeolocation from 'react-hook-geolocation';
import flyTo from 'components/flyTo';
import { lineLayer } from 'components/layers';
import SvgTrash from 'icons/SvgTrash';
import SvgLeftArrow from 'icons/SvgLeftArrow';
import SvgCopy from 'icons/SvgCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import NotFoundGroup from './NotFoundGroup';

const Viewer = () => {
  // 문서 참조해서 값 가져와서 뿌리기
  const mapRef = useMap();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('id'); // ?g=
  const isParams = groupId === null || groupId === '' ? false : true;
  const [groupData, setGroupData] = useState(null); // 기본은 null임
  const [notLoaded, setNotLoaded] = useState(false);
  const [isGroupDeleted, setIsGroupDeleted] = useState(false);
  const thisUrl = window.location.href;

  const [isMapLoad, setIsMapLoad] = useState(false);
  const geolocation = useGeolocation({
    // 현재 실시간 위치를 담고있는 객체
    enableHighAccuracy: true,
  });
  const [cp, setCp] = useState({
    lng: null,
    lat: null,
  }); // 현재 위치 데이터
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [isGroupData, setIsGroupData] = useState(false);
  const [directionsData, setDirectionsData] = useState(null);
  const [isDirectionData, setIsDirectionsData] = useState(false);
  const [isReassignment, setIsReassignment] = useState(false);

  const directions = async () => {
    const {
      position: { lng, lat },
    } = groupData;
    const start = [cp.lng, cp.lat];
    const end = [lng, lat];
    const data = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`,
      { method: 'GET' }
    ).then(data => data.json());
    // 라인 그릴 데이터로 변환하기
    const routes = data.routes[0].geometry.coordinates;
    const directionData = [...routes];
    setDirectionsData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [...directionData],
      },
    }); // 라인 데이터 완료
    setIsDirectionsData(true); // 길찾기 수행함
    flyTo({ ref: mapRef, lat: cp.lat, lng: cp.lng }); // 또한, 자동 포커싱 해도 바로는 안되니 현재위치로 포커싱함!
  };

  const onMapLoad = () => {
    const { lng, lat } = cp;
    flyTo({ ref: mapRef, lng: lng, lat: lat });
    setIsMapLoad(true); // 맵 로드됨
    directions();
  };

  useEffect(() => {
    const { longitude, latitude } = geolocation;
    const { lng, lat } = cp;
    const isDifferent = longitude != lng && latitude != lat; // 변경된 위치인지 구하는 변수
    if (isDifferent) {
      // 위치가 변동할때만 현재위치를 재정의함
      const newCurrentPosition = {
        lng: longitude,
        lat: latitude,
      };
      setCp({
        ...newCurrentPosition,
      });
      if (!isGeolocation) {
        setIsGeolocation(true);
      }
      // 계속 포커싱 함
      if (isMapLoad) {
        console.log(1);
        flyTo({ ref: mapRef, lng: longitude, lat: latitude });
      }
    }
  }, [geolocation]);

  const onClickDelete = async () => {
    await deleteGroup({ groupId })
      .then(() => {
        setIsGroupDeleted(true);
        toast.success('일정이 삭제되었습니다');
      })
      .catch(err => {
        toast.error('삭제 에러');
      });
  };
  const onClickRedirect = () => navigate('/');
  const onCopy = () => {
    toast.success('일정에 대한 URL을 복사했습니다');
  };

  useEffect(() => {
    // 데이터 로드
    const getGroup = async () => {
      const groupData = await loadGroup({ groupId });
      if (groupData === null) {
        setNotLoaded(true);
      } else {
        setGroupData(groupData);
        setIsGroupData(true);
      }
    };
    getGroup().catch(err => {
      console.log('로드 안됨');
      setNotLoaded(true); // Error (찾을 수 없는 파일...)일때 NotLoadedFile 뜨게 함
    });
  }, []);

  useEffect(() => {
    if (isReassignment) {
      console.log(1);
    }
  }, [isReassignment]);

  return isParams ? (
    !notLoaded ? (
      isGroupData ? (
        !isGroupDeleted ? (
          isGeolocation ? (
            <FullScreen>
              <ModalWrapper>
                <Modal>{groupData.comment}</Modal>
              </ModalWrapper>
              <Maps ref={mapRef} onLoad={onMapLoad}>
                <MarkerWrapper>
                  <Marker
                    // 현위치 마커
                    latitude={cp.lat}
                    longitude={cp.lng}
                    anchor="center" // popup을 위한 anchor
                  >
                    <MarkerPing />
                  </Marker>
                  <Marker
                    // 위치 마커
                    latitude={groupData.position.lat}
                    longitude={groupData.position.lng}
                    anchor="center" // popup을 위한 anchor
                  >
                    <PositioningMarkerPing />
                  </Marker>
                </MarkerWrapper>
                <SourceWrapper>
                  {isDirectionData ? (
                    // 길찾기 가이드 선은 계속해서 변동하기에 이런식으로 토글로 구성한 것임 (길찾기 시에만 길찾기 가이드 선이 표시됨)
                    <Source
                      id="directionsData"
                      type="geojson"
                      data={directionsData}
                    >
                      <Layer {...lineLayer}></Layer>
                    </Source>
                  ) : (
                    ''
                  )}
                </SourceWrapper>
                <ButtonWrapper>
                  <div>
                    <Button onClick={onClickRedirect}>
                      <SvgLeftArrow />
                    </Button>
                  </div>
                  <div>
                    <Button>
                      <CopyToClipboard text={thisUrl} onCopy={onCopy}>
                        <SvgCopy />
                      </CopyToClipboard>
                    </Button>
                    <TrashBtnWrapper>
                      <Button onClick={onClickDelete}>
                        <SvgTrash />
                      </Button>
                    </TrashBtnWrapper>
                  </div>
                </ButtonWrapper>
              </Maps>
            </FullScreen>
          ) : (
            ''
          )
        ) : (
          <Navigate to="/" /> // 삭제후 바로 리다렉션
        )
      ) : (
        ''
      )
    ) : (
      <NotFoundGroup />
    )
  ) : (
    <NotFoundPage />
  );
};

const FullScreen = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  // mapbox 로고 지우기
  .mapboxgl-ctrl-logo {
    display: none;
  }
  // mapbox copyright 로고 지우기
  .mapboxgl-ctrl-attrib {
    display: none;
  }
`;
const ModalWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
`;
const Modal = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: #e9ecef;
  border-radius: 20px;
  font-size: 30px;
  margin: 15px;
  padding: 15px;
  opacity: 0.9;
`;
const MarkerWrapper = styled.div``;
const MarkerPing = styled.div`
  height: 20px;
  width: 20px;
  background-color: #f03e3e;
  opacity: 0.9;
  border-radius: 50%;
  border: white solid 2.5px;
  box-shadow: 0 0 0 0 #f00;
  animation: pulse 1.7s infinite;
  // -webkit-animation 사용안해도됨!
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
      -moz-box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(255, 107, 107, 0.4);
      -moz-box-shadow: 0 0 0 15px rgba(255, 107, 107, 0.4);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
      -moz-box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
  }
`;
const PositioningMarkerPing = styled.div`
  height: 20px;
  width: 20px;
  background-color: blue;
  opacity: 0.9;
  border-radius: 50%;
`;
const SourceWrapper = styled.div``;
const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;
const TrashBtnWrapper = styled.div`
  svg {
    fill: #e03131;
  }
`;
const Button = styled.button`
  all: unset;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px;
  width: 65px;
  border-radius: 50%;
  margin: 15px;
  background-color: #e9ecef;
  opacity: 0.9;
  svg {
    height: 42.5px;
    width: 42.5px;
  }
`;
export default Viewer;
