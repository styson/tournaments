import { DragBox } from './styled/Box';
import { Draggable } from 'react-beautiful-dnd';
import React from 'react';

export default class Scenario extends React.Component {
  render() {
    const id = this.props.scenario.sk.indexOf('ROUN') === 0 ? 
      this.props.scenario.sk : 
      `${this.props.round}_${this.props.scenario.sk}`;
    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <DragBox
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              <b>{this.props.scenario.id}:</b> {this.props.scenario.name}
            </DragBox>
          )
        }}
      </Draggable>
    );
  }
}
