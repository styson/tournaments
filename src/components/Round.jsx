import { Col } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import React from 'react';
import styled from 'styled-components';
import Scenario from './scenario';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
const Title = styled.h3`
  padding: 2px 8px;
`;
const ScenarioList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

export default class Round extends React.Component {
  render() {
    return (
      <Col md='3'>
        <Container>
          <Title>{this.props.round.name}</Title>
          <Droppable droppableId={this.props.round.sk} isDropDisabled={(this.props.round.name==='Scenarios')}>
            {(provided, snapshot) => { 
              return (
                <ScenarioList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDragging={snapshot.isDragging}                  
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.scenarios.map((scenario, index) => {
                    return <Scenario key={scenario.sk} round={this.props.round.sk} scenario={scenario} index={index} />
                  })}
                  {provided.placeholder}
                </ScenarioList>
              )
            }}
          </Droppable>
        </Container>
      </Col>
    );
  }
}