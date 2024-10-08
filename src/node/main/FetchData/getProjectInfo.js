const getProjectInfo = async () => {
  const response = await fetch('https://01.kood.tech/api/object/johvi', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};
export default getProjectInfo;
