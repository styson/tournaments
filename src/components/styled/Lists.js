import styled from 'styled-components';

const PlayerList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
  max-height: 600px;
  overflow-y: auto;
`;

const ExtraPlayerList = styled(PlayerList)`
  padding-top: 10px;
  padding-bottom: 0;
`;

const MatchList = styled.div`
  min-height: 100px;
  max-height: 860px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ScenarioList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
  max-height: ${props => (props.isDraggingOver ? '600px' : '900px')};
  overflow-y: auto;
`;

export {
  PlayerList,
  ExtraPlayerList,
  MatchList,
  ScenarioList,
}