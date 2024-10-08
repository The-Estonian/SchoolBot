const helpInfo = () => {
  return `
┌─────────────────────────────┬─────────────────────────────────────────────┐
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
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !remove <n>                 │ to remove n amount of messages from channel │
├─────────────────────────────┼─────────────────────────────────────────────┤
│ !crash                      │ Implements server crash for testing         │
├─────────────────────────────┴─────────────────────────────────────────────┤
│        NB: Bot will delete his response and your command in 10s           │
└───────────────────────────────────────────────────────────────────────────┘`;
};

export default helpInfo;
