const getUserData = async (token, userId) => {
  // const token = await fetchToken();
  const response = await fetch(
    'https://01.kood.tech/api/graphql-engine/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `query {
  user_public_view(where:{id: {_in: [${userId}]}}){
    id
    login
    firstName
    lastName
    events{
      level
      event{
        path
      }
    }
  }
}`,
      }),
    }
  );
  return await response.json();
};
export default getUserData;
