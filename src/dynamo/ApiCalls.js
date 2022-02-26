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

export const putItem = async (body) => {
  API.put('apiDirector', '/director', {
    body
  });
}