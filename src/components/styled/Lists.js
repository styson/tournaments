import styled from 'styled-components';

const PlayerList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

const ExtraPlayerList = styled(PlayerList)`
  padding-top: 10px;
  padding-bottom: 0;
`;

const ScenarioList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
  max-height: 600px;
  overflow-y: auto;
`;

export {
  PlayerList,
  ExtraPlayerList,
  ScenarioList,
}