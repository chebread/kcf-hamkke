import SvgPlus from 'icons/SvgPlus';
import SvgTodo from 'icons/SvgTodo';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Home = () => {
  const navigate = useNavigate();
  const onClickAdd = () => {
    navigate('new');
  };
  return (
    <FullScreen>
      <SvgWrapper>
        <SvgTodo />
      </SvgWrapper>
      <Blank />
      <Button onClick={onClickAdd}>
        <SvgPlus height={45} width={45} />
      </Button>
    </FullScreen>
  );
};

const FullScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const SvgWrapper = styled.div`
  svg {
    height: 200px;
    width: 200px;
  }
`;
const Blank = styled.div`
  padding: 5px;
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
`;

export default Home;
