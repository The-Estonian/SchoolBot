const getUserFirstName = (data) => {
  if (data.errors != undefined) {
    message.reply('Query did not succeed, please provide different name!');
    console.log('DATA: ', data.errors);
    return;
  }

  let returnData = `\`\`\`
    Received user data:`;
  data?.data?.user_public_view.forEach((item) => {
    let spacer = Math.max(
      item.id.toString().length,
      item.login.length,
      item.firstName.length,
      item.lastName.length
    );
    if (spacer < 14) spacer = 14;
    returnData += `
┌───────────────────────────┐
│ ID:         ${item.id}${' '.repeat(spacer - item.id.toString().length)}│
├───────────────────────────┤
│ Login:      ${item.login}${' '.repeat(spacer - item.login.length)}│
├───────────────────────────┤
│ First Name: ${item.firstName}${' '.repeat(spacer - item.firstName.length)}│
├───────────────────────────┤
│ Last Name:  ${item.lastName}${' '.repeat(spacer - item.lastName.length)}│
└───────────────────────────┘`;
  });
  returnData += `\`\`\``;

  return returnData;
};

export default getUserFirstName;
