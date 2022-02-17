import { API } from 'aws-amplify';

export const GetItems = async (pk, sortBy, callback) => {
  API.get('apiDirector', `/director/${pk}`)
    .then(res => {
      const items = res.Items.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      callback(items);
    });
};

// export const handleDelete = async (pk, sk, refresh) => {
//   API.del('apiDirector', `/director/object/${pk}/${sk}`)
//     .then(res => refresh());
// };
