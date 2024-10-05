const getUserFirstName = (data) => {
  let returnData = `
        Received user data:
----------------------------------`;
  if (data.errors != undefined) {
    message.reply('Query did not succeed, please provide different name!');
    console.log('DATA: ', data.errors);
    return;
  }

  data?.data?.user_public_view.forEach((item) => {
    returnData += `
ID:         ${item.id}
Login:      ${item.login}
First Name: ${item.firstName}
Last Name:  ${item.lastName}
---------------------`;
  });
  return returnData;
};

export default getUserFirstName;
