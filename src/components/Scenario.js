import { Draggable } from 'react-beautiful-dnd';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 4px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightblue' : 'white')};
`;

export default class Scenario extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.scenario.sk} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <Container
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              <b>{this.props.scenario.id}:</b> {this.props.scenario.name}
            </Container>
          )
        }}
      </Draggable>
    );
  }
}
