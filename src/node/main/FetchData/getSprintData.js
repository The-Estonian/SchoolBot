const getSprintData = async (token, eventId) => {
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
        query: `query querySprinters {
  event_by_pk(id:${eventId}){
    path
    startAt
    registrations{
      users{
        id
      }
    }
    usersRelation{
      userLogin
      level
    }
  }
}`,
      }),
    }
  );
  return await response.json();
};
export default getSprintData;
