const helpInfo = () => {
  return `
┌───────────────────────────────────────────────────────────────────────────┐
│  Super Mega ULTRA Bot Version: ${process.env.GIT_COMMIT}   │
├─────────────────────────────┬─────────────────────────────────────────────┤
│ Project status:             │ WIP                                         │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !sprint <id>                │ to get the current sprinters data           │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !userid <id>                │ to get user data with the given id          │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !firstname <name>           │ to get all user with the given first name   │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !firstname <name><lastname> │ to get users with the name and lastname     │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !lastname <name>            │ to get all users with the given last name   │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !project <name>             │ to get project info                         │
├─────────────────────────────┴─────────────────────────────────────────────┤
│        NB: Bot will delete his response and your command in 30s           │
└───────────────────────────────────────────────────────────────────────────┘`;
};

export default helpInfo;
