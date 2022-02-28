import { Box } from './styled/Box';
import { Button, Col, Form, Row } from 'react-bootstrap';
// import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { MatchPlayer } from './styled/Match';
import { useState } from 'react';
import Creatable from 'react-select/creatable';
import React from 'react';

const missing = 'Odd player count.';

const selectStyles = {
  option: styles => ({
    ...styles,
    color: 'green',
    lineHeight: '12px',
  }),
};

export default function Match({ match, index, handleClick }) {
  const initialFormData = Object.freeze(match);

  const [formData, updateFormData] = useState(initialFormData);

  const player1 = match.p1?.name;
  const player2 = match.p2?.name || missing;

  const winnerChange = (e) => {
    // console.log(e.target.id)
    const p1Winner = (e.target.id === `winner1${index}`);
    updateFormData({
      ...formData,
      p1Winner,
    });
  };

  const sideChange = (e) => {
    // console.log(e.target.id)
    const p1Side = (e.target.id === `allied1${index}`) ? 'Allied' : 'Axis';
    const p2Side = (e.target.id !== `allied1${index}`) ? 'Allied' : 'Axis';
    updateFormData({
      ...formData,
      p1Side,
      p2Side,
    });
  };

  const selectChange = (e) => {
    // console.log(e)
    const scenario = match.scenarioList.find(s => s.sk === e.value);
    updateFormData({
      ...formData,
      scenario,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // handleClick(form);
  }

  const options = [];
  match.scenarioList.forEach(s => {
    options.push({
      value: s.sk,
      label: `${s.id}: ${s.name}`,
    });
  });

  return (
    <Box style={{ padding: '10px' }}>
      <Row>
        <Col md='6'>
          <MatchPlayer className=''>{player1}</MatchPlayer>
        </Col>
        <Col md='6'>
        <MatchPlayer textColor={ player2 === missing ? 'red' : 'black'}>{player2}</MatchPlayer>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
      <Creatable 
        name={`scenario${index}`} options={options} onChange={selectChange} 
        styles={selectStyles} placeholder='Scenario...' className='mt-2'
      />
      <Row className='mt-2'>
        <Col md='6'>
          <Form.Check
            label='Winner' name={`group1${index}`} className='ms-3'
            type='radio' id={`winner1${index}`} onChange={winnerChange}
          />
        </Col>
        <Col md='6'>
          <Form.Check
            label='Winner' name={`group1${index}`} className='ms-3'
            type='radio' id={`winner2${index}`} onChange={winnerChange}
          />
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <Form.Check
            label='Allied' name={`group2${index}`} className='ms-3'
            type='radio' id={`allied1${index}`} onChange={sideChange}
          />
        </Col>
        <Col md='6'>
          <Form.Check
            label='Allied' name={`group2${index}`} className='ms-3'
            type='radio' id={`allied2${index}`} onChange={sideChange}
          />
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 2, offset: 10 }}>
          <Button
            key={index}
            size='sm' className='px-1 py-0'
            variant='outline-secondary'
            type='submit'
          >
            Save
          </Button>
        </Col>
      </Row>
      </Form>
    </Box>
  );
}

            // <IoCheckmarkCircleOutline
            //   size='small'
            // />
