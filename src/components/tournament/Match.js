import { Button, Col, Form, Row } from 'react-bootstrap';
import { MatchBox, MatchPlayer } from '../styled/Match';
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

export default function Match({ match, matchKey, index, handleSave }) {
  const initialFormData = Object.freeze(match);
  const [formData, updateFormData] = useState(initialFormData);
  const [changes, setChanges] = useState(false);

  const player1 = match.p1?.name;
  // const player1rank = match.p1?.rank;
  const player2 = match.p2?.name || missing;
  // const player2rank = match.p2?.rank || '';
  let p1Winner = match.p1Winner;
  let p2Winner = match.p2Winner || false;
  let noWinner = !p1Winner && !p2Winner;

  const winnerChange = (e) => {
    setChanges(true);
    p1Winner = (e.target.id === `winner1${matchKey}`);
    p2Winner = (e.target.id === `winner2${matchKey}`);
    noWinner = (e.target.id === `noWinner${matchKey}`);
    updateFormData({
      ...formData,
      p1Winner,
      p2Winner,
      noWinner,
      index,
    });
  };

  const sideChange = (e) => {
    setChanges(true);
    const p1Allied = e.target.id === `allied1${matchKey}`;
    const p2Allied = e.target.id === `allied2${matchKey}`;
    const noSide = e.target.id === `noSide${matchKey}`;
    updateFormData({
      ...formData,
      p1Allied,
      p2Allied,
      noSide,
      index,
    });
  };

  const selectChange = (e) => {
    setChanges(true);
    const scenario = match.scenarioList.find(s => s.sk === e.value);
    updateFormData({
      ...formData,
      scenario,
      index,
    });
  };

  const handleSubmit = async (e) => {
    setChanges(false);
    e.preventDefault();
    if (formData.index !== undefined) {
      handleSave(formData);
    }
  }

  const options = [];
  match.scenarioList.forEach(s => {
    options.push({
      value: s.sk,
      label: `${s.id}: ${s.name}`,
    });
  });

  return (
    <MatchBox key={matchKey}>
      <Row>
        <Col md='6'>
          <MatchPlayer>{player1}</MatchPlayer>
        </Col>
        <Col md='6'>
        <MatchPlayer textColor={ player2 === missing ? 'red' : 'black'}>{player2}</MatchPlayer>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
      <Creatable 
        name={`scenario${matchKey}`} options={options} onChange={selectChange} 
        styles={selectStyles} placeholder='Scenario...' className='mt-2'
        value = {
          options.filter(option => option.value === formData.scenario.sk)
        }
      />
      <Row className='mt-1'>
        <Col md='4'>
          <Form.Check
            label='Winner' name={`group1${matchKey}`} className='ms-3'
            type='radio' id={`winner1${matchKey}`} onChange={winnerChange}
            checked={formData.p1Winner}
          />
        </Col>
        <Col md='2'>
          <Form.Check
            label='' name={`group1${matchKey}`} className='ms-3'
            type='radio' id={`noWinner${matchKey}`} onChange={winnerChange}
            checked={formData.noWinner}
          />
        </Col>
        <Col md='4'>
          <Form.Check
            label='Winner' name={`group1${matchKey}`} className='ms-3'
            type='radio' id={`winner2${matchKey}`} onChange={winnerChange}
            checked={formData.p2Winner}
          />
        </Col>
      </Row>
      <Row>
        <Col md='4'>
          <Form.Check
            label='Allied' name={`group2${matchKey}`} className='ms-3'
            type='radio' id={`allied1${matchKey}`} onChange={sideChange}
            checked={formData.p1Allied}
          />
        </Col>
        <Col md='2'>
          <Form.Check
            label='' name={`group2${matchKey}`} className='ms-3'
            type='radio' id={`noSide${matchKey}`} onChange={sideChange}
            checked={formData.noSide}
          />
        </Col>
        <Col md='4'>
          <Form.Check
            label='Allied' name={`group2${matchKey}`} className='ms-3'
            type='radio' id={`allied2${matchKey}`} onChange={sideChange}
            checked={formData.p2Allied}
          />
        </Col>
        <Col md='2'>
          <Button
            key={matchKey}
            size='sm' className='px-1 py-0 float-end'
            variant={changes ? 'success' : 'outline-secondary'}
            type='submit'
          >
            Save
          </Button>
        </Col>
      </Row>
      </Form>
    </MatchBox>
  );
}