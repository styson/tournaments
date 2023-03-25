import { API } from 'aws-amplify';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { GetItems, putItem } from '../dynamo/ApiCalls';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Error } from '../components/styled/Error';
import Header from '../components/Header';
import Player from '../components/Player';
import AddPlayersFromFile from '../components/setup/AddPlayersFromFile';

const ratingPlaceHolder = 'Enter Rating...';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});

  const refresh = async () => {
    GetItems('PLAYERS', 'name', setPlayers);
    cancel();
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form state
  const [formTitle, setFormTitle] = useState('Add Player');
  const [playerCode, setPlayerCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerRating, setPlayerRating] = useState('');
  const [placeHolder, setPlaceHolder] = useState(ratingPlaceHolder);
  const [playerEmail, setPlayerEmail] = useState('');
  const [playerPhone, setPlayerPhone] = useState('');
  const [playerLocation, setPlayerLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(playerName === '') {
      setError('Player Name is required.');
      return;
    }

    setFormTitle('Add Player');
    setError('');

    const pk = 'PLAYERS';
    const sk = player.sk || `PLAY_${uuidv4()}`;

    API.post('apiDirector', '/director', {
      body: {
        pk,
        sk,
        name: playerName,
        code: playerCode,
        rating: playerRating,
        email: playerEmail,
        phone: playerPhone,
        location: playerLocation,
      }
    }).then(res => refresh());

    setPlayerName('');
    setPlayerCode('');
    setPlayerRating('');
    setPlayerEmail('');
    setPlayerPhone('');
    setPlayerLocation('');
    setError('');
  };

  const cancel = async (e) => {
    if (e) e.preventDefault();

    setFormTitle('Add Player');
    setError('');

    setPlayerName('');
    setPlayerCode('');
    setPlayerRating('');
    setPlayerEmail('');
    setPlayerPhone('');
    setPlayerLocation('');
  };

  const updateRatings = async (e) => {
    if (e) e.preventDefault();
    players.forEach((p, n) => {
      fetch(`https://asl-ratings.org/web/api/getPlayer.php?name=${p.name}`, {
        method: 'GET',
        mode:'cors',
      })
      .then((response) => {
        return response.json();
      })
      .then(function(data) {
        if (data.elo && data.elo.length > 0) {
          const updatePlayer = { 
            ...p,
            rating: data.elo,
            code: data.code,
          }

          const index = players.findIndex(_ => _.pk === updatePlayer.pk && _.sk === updatePlayer.sk);
          players[index] = updatePlayer;
          // console.log(`${JSON.stringify(updatePlayer)}`);

          putItem(updatePlayer);
        }
      })
      .catch((err)=>{
        console.log('err ',err)
      });
    });
  };

  const findRating = async (e) => {
    if (e) e.preventDefault();

    setPlaceHolder('Searching...');
    fetch(`https://asl-ratings.org/web/api/getPlayer.php?name=${playerName}`, {
      method: 'GET',
      mode:'cors',
    })
    .then((response) => {
      setPlaceHolder(ratingPlaceHolder);
      return response.json();
    })
    .then(function(data) {
      if (data.elo && data.elo.length > 0) {
        setPlayerRating(data.elo);
        setPlayerCode(data.code);
      } else {
        setError(data.name);
      }
    })
    .catch((err)=>{
      console.log('err ',err)
    });
  };

  const findRatingByCode = async (e) => {
    if (e) e.preventDefault();

    setPlaceHolder('Searching...');
    fetch(`https://asl-ratings.org/web/api/getPlayer.php?code=${playerCode}`, {
      method: 'GET',
      mode:'cors',
    })
    .then((response) => {
      setPlaceHolder(ratingPlaceHolder);
      return response.json();
    })
    .then(function(data) {
      if (data.elo && data.elo.length > 0) {
        setPlayerRating(data.elo);
        setPlayerName(data.name);
      } else {
        setError(data.name);
      }
    })
    .catch((err)=>{
      console.log('err ',err)
    });
  };

  const handleRowClick = async (pk, sk) => {
    setError('');
    const player = players.length === 0 ? {} : players.find(_ => _.pk === pk && _.sk === sk);
    if (player.pk !== undefined) {
      setFormTitle('Update Player');
      setPlayer(player);
      setPlayerCode(player.code || '');
      setPlayerName(player.name || '');
      setPlayerRating(player.rating || '');
      setPlayerEmail(player.email || '');
      setPlayerPhone(player.phone || '');
      setPlayerLocation(player.location || '');
    }
  };

  const handleDelete = async (pk, sk) => {
    API.del('apiDirector', `/director/object/${pk}/${sk}`)
      .then(res => refresh());
  };

  return ( 
    <>
      <Header />
      <Container fluid id = 'main' >
        <Row>
          <Col md={3}>
            <h1>Players</h1>
          </Col>
          <Col md={9}>
            <Button
              size='sm' className='mt-2 px-1 py-0 float-end'
              variant='outline-success'
              onClick={(e) => updateRatings(e)}
            >
              Update Player Ratings
            </Button>
          </Col>
        </Row> 
        <Row>
          <Col md={9}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>PRW Code</th>
                  <th>Current Rating</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                { players.map((p, index) => (
                  <Player
                    player={p}
                    key={index}
                    handleDelete={handleDelete}
                    handleRowClick={handleRowClick}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={3}>
            <Form onSubmit={handleSubmit}>
              <Card>
                <Card.Body>
                  <Card.Title>{formTitle}</Card.Title>
                    <InputGroup className='mb-2'>
                      <Form.Control
                        type='text'
                        placeholder='Enter Name...'
                        value={playerName}
                        autoComplete='off'
                        onChange={(e) => setPlayerName(e.target.value)}
                      />
                      <Button
                        id='prwLookup'
                        size='sm'
                        variant='success'
                        onClick={(e) => findRating(e)}
                      >
                        ?
                      </Button>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                      <Form.Control
                        type='text'
                        placeholder='Enter Code...'
                        value={playerCode}
                        autoComplete='off'
                        onChange={(e) => setPlayerCode(e.target.value)}
                      />
                      <Button
                        id='prwCodeLookup'
                        size='sm'
                        variant='success'
                        onClick={(e) => findRatingByCode(e)}
                      >
                        ?
                      </Button>
                    </InputGroup>
                    <Form.Control
                      type='text'
                      className='mb-2'
                      placeholder={placeHolder}
                      value={playerRating}
                      autoComplete='off'
                      onChange={(e) => setPlayerRating(e.target.value)}
                    />
                    <Form.Control
                      className='mb-2'
                      type='text'
                      placeholder='Enter Email...'
                      value={playerEmail}
                      autoComplete='off'
                      onChange={(e) => setPlayerEmail(e.target.value)}
                    />
                    <Form.Control
                      className='mb-2'
                      type='text'
                      placeholder='Enter Phone...'
                      value={playerPhone}
                      autoComplete='off'
                      onChange={(e) => setPlayerPhone(e.target.value)}
                    />
                    <Form.Control
                      className='mb-2'
                      type='text'
                      placeholder='Enter Location...'
                      value={playerLocation}
                      autoComplete='off'
                      onChange={(e) => setPlayerLocation(e.target.value)}
                    />
                    <div className='d-flex'>
                      <Button
                        className='flex-grow-1'
                        size='sm'
                        type='submit'
                        variant='primary'
                      >
                        {formTitle}
                      </Button>
                      <Button
                        className='flex-grow-1 ms-2'
                        size='sm'
                        onClick={(e) => cancel(e)}
                        variant='outline-secondary'
                      >
                        Cancel
                      </Button>
                    </div>
                    <Error>
                      {error}
                    </Error>
                </Card.Body>
              </Card>
            </Form>
          </Col>
        </Row>
        <Row className='d-none'>
          <Col md={9}>
            <h4>Other possible players</h4>
            <AddPlayersFromFile />
          </Col>
        </Row>
      </Container>
    </>
  );
}

// player rating api
// https://asl-ratings.org/web/api/getPlayer.php?name=Sam%20Tyson