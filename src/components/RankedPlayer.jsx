import { Draggable } from 'react-beautiful-dnd';
import { Badge } from 'react-bootstrap';
import React from 'react';
import styled from 'styled-components';

const Player = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 4px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightblue' : 'white')};
`;

export default class RankedPlayer extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.player.sk} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <Player
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              {this.props.player.name}
              <Badge bg='secondary' className={`float-end ${this.props.showRank ? '' : 'd-none'}`}>
                {this.props.index+1}
              </Badge>              
            </Player>
          )
        }}
      </Draggable>
    );
  }
}