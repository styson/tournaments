import { DragBox } from '../styled/Box';
import { Draggable } from 'react-beautiful-dnd';
import { Badge } from 'react-bootstrap';
import React from 'react';

export default class RankedPlayer extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.player.sk} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <DragBox
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              {this.props.player.name}
              <sup className={`ms-1 fw-lighter ${this.props.showRating ? '' : 'd-none'}`}>
                ({this.props.player.rating || ''})
              </sup>              
              <Badge bg='secondary' className={`float-end ${this.props.showRank ? '' : 'd-none'}`}>
                {this.props.index+1}
              </Badge>              
            </DragBox>
          )
        }}
      </Draggable>
    );
  }
}