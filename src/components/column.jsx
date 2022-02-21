import { Col } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import React from 'react';
import styled from 'styled-components';
import Task from './task';

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
const TaskList = styled.div`
  padding: 2px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

export default class Column extends React.Component {
  render() {
    return (
      <Col md='3'>
        <Container>
          <Title>{this.props.column.title}</Title>
          <Droppable droppableId={this.props.column.id}>
            {(provided, snapshot) => { 
              return (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDragging={snapshot.isDragging}                  
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.tasks.map((task, index) => {
                    return <Task key={task.id} task={task} index={index} />
                  })}
                  {provided.placeholder}
                </TaskList>
              )
            }}
          </Droppable>
        </Container>
      </Col>
    );
  }
}