import { Box } from '../styled/Box';
import { Col } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import { ScenarioList } from '../styled/Lists';
import { Title } from '../styled/Headers';
import React from 'react';
import Scenario from './scenario';

export default class Round extends React.Component {
  render() {
    return (
      <Col md={this.props.colSize}>
        <Box>
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
        </Box>
      </Col>
    );
  }
}