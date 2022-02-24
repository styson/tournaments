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
    const id = this.props.scenario.sk.indexOf('ROUN') === 0 ? 
      this.props.scenario.sk : 
      `${this.props.round}_${this.props.scenario.sk}`;
    return (
      <Draggable draggableId={id} index={this.props.index}>
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
