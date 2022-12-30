import { API } from 'aws-amplify';

export const GetItems = async (pk, sortBy, callback) => {
  API.get('apiDirector', `/director/${pk}`)
    .then(res => {
      const items = res.Items.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      callback(items);
    });
};

export const delRoundScenario = async (pk, sk) => {
  API.del('apiDirector', `/director/object/${pk}/${sk}`);
}

export const getItem = async (pk, sk, callback) => {
  API.get('apiDirector', `/director/object/${pk}/${sk}`)
    .then(res => callback(res))
    .catch(error => console.log(error.response.data));
}

export const putRoundScenario = async (scen) => {
  API.put('apiDirector', '/director', {
    body: {
      pk: `${scen.pk}`,
      sk: `${scen.sk}`,
      name: scen.name,
      id: scen.id,
    }
  });
}

export const putItem = async (body, callback) => {
  if (body.round && body.activePlayers.length === 0) {
    if (body.rankingsComplete && body.activePlayers.length === 0) {
      // console.log('removing activePlayers')
      return;
    }
  }
  API.put('apiDirector', '/director', {
    body
  }).then(() => {
    if(callback)
      callback();
  });
}