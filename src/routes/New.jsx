import pushDb from 'components/pushDb';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Maps from 'routes/Maps';
import styled from 'styled-components';
import flyTo from 'components/flyTo';
import useGeolocation from 'react-hook-geolocation';
import { Marker, useMap } from 'react-map-gl';
import { Navigate } from 'react-router-dom';
import SvgCheck from 'icons/SvgCheck';

const New = () => {
  const mapRef = useMap();
  const [isAddedComment, setIsAddedComment] = useState(false);
  const [isAddedPosition, setIsAddedPosition] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [comment, setComment] = useState('');
  const [position, setPosition] = useState({
    lng: null,
    lat: null,
  });
  const [groupId, setGroupId] = useState('');

  const [isPosition, setIsPosition] = useState(false);
  const [isGeolocation, setIsGeolocation] = useState(false);
  const geolocation = useGeolocation({
    // 현재 실시간 위치를 담고있는 객체
    enableHighAccuracy: true,
  });
  const [cp, setCp] = useState({
    lng: null,
    lat: null,
  }); // 현재 위치 데이터
  const [isMapLoad, setIsMapLoad] = useState(false);

  const onMapLoad = () => {
    const { lng, lat } = cp;
    flyTo({ ref: mapRef, lng: lng, lat: lat });
    setIsMapLoad(true); // 맵 로드됨
  };
  const onClickMap = e => {
    // (1): 맵을 클릭시 클릭한 위치에 마커가 생성되며 다른 위치 클릭시 기존의 마커 없어지고 새로운 마커가 생성됨
    const { lng, lat } = e.lngLat;
    setPosition({
      lng: lng,
      lat: lat,
    });
    setIsPosition(true);
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
      // 자동 포커싱 true시에만 자동 포커싱 함!
    }
  }, [geolocation]);

  const onChange = e => {
    const {
      target: { value },
    } = e;
    setComment(value);
  };
  const onKeyDown = e => {
    const {
      keyCode,
      target: { value },
    } = e;
    // console.log(e.target.value);
    if (keyCode === 13) {
      setComment(value);
      setIsAddedComment(true);
    }
  };
  const onClickAddComment = () => {
    const isComment = comment != '';
    if (!isComment) {
      toast.error('코멘트를 기입하세요');
    } else {
      // 코멘트는 이미 저장되어있음
      setIsAddedComment(true);
    }
  };
  const onClickAddPosition = () => {
    // 선택한 위치가 이미 저장이 되어 있음
    setIsAddedPosition(true);
  };

  useEffect(() => {
    const getData = async () => {
      const { lng, lat } = position;
      const docRefId = await pushDb({
        comment: comment,
        position: {
          lng: lng,
          lat: lat,
        },
      });
      return docRefId;
    };
    console.log(1);
    if (isAddedPosition) {
      console.log(2);
      // 여기서 업로드하기
      // 하나의 문서에 값 추가하고 그 참조 아이디를 사용자가 접근할 수 있도록 하기
      getData()
        .then(docRefId => {
          console.log(docRefId);
          setGroupId(docRefId);
          setIsUpload(true);
        })
        .catch(err => {
          console.log(err);
          toast.err('로드되지 못함');
        });
    }
  }, [isAddedPosition]);

  return !isAddedComment ? (
    <FullScreen>
      <Center>
        <Input
          type="text"
          placeholder="코맨트를 입력하세요"
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </Center>
      <Bottom>
        <Button onClick={onClickAddComment}>
          <SvgCheck height={45} width={45} />
        </Button>
      </Bottom>
    </FullScreen>
  ) : !isAddedPosition ? (
    isGeolocation ? (
      <FullScreenMap>
        <Maps ref={mapRef} onLoad={onMapLoad} onClick={onClickMap}>
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
              // 클릭하면 생기는 위치 지정 마커
              latitude={position.lat}
              longitude={position.lng}
              anchor="center" // popup을 위한 anchor
            >
              <PositioningMarkerPing />
            </Marker>
          </MarkerWrapper>
          {isPosition ? (
            <ButtonWrapper>
              <MapButton onClick={onClickAddPosition}>
                <SvgCheck height={45} width={45} />
              </MapButton>
            </ButtonWrapper>
          ) : (
            ''
          )}
        </Maps>
      </FullScreenMap>
    ) : (
      <h1></h1>
    )
  ) : // 만약 만날 위치 추가가 될시 데이터를 업로드하고 업로드시 로딩을 업에기
  isUpload ? (
    <Navigate to={`/g?id=${groupId}`} />
  ) : (
    <h1></h1>
  );
};

const FullScreen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &::placeholder {
    color: dimgray;
  }
`;
const Center = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input`
  all: unset;
  z-index: 1;
  font-size: 30px;
  width: 50%;
`;
const Bottom = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;
const Button = styled.button`
  all: unset;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 105px;
  height: 65px;
  border-radius: 20px;
  background-color: #e9ecef;
  z-index: 1;
  margin: 15px;
`;

const FullScreenMap = styled.div`
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
const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;
const MapButton = styled.button`
  all: unset;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 105px;
  height: 65px;
  border-radius: 20px;
  background-color: #e9ecef;
  z-index: 1;
  margin: 15px;
`;
export default New;
