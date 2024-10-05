const getUserName = async (token, firstName, lastName) => {
  let query = `query {
  user_public_view(where:{
    _and: [
      {firstName: {_eq: "${firstName.replace(/"/g, '\\"')}"}}`;
  lastName
    ? (query += `{lastName: {_eq: "${lastName.replace(/"/g, '\\"')}"}}`)
    : '';
  query += `]
  }){
    id
    login
    firstName
    lastName
  }
}`;

  const response = await fetch(
    'https://01.kood.tech/api/graphql-engine/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );
  return await response.json();
};
export default getUserName;
