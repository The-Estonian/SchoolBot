const truncateForDiscord = (str) => {
  const maxLength = 2000; // Discord message limit
  return str.length > maxLength ? str.slice(0, maxLength - 3) + `\`\`\`` : str;
};
export default truncateForDiscord;