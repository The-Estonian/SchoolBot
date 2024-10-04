const capitalizeFirstLetter = (string) => {
  let stringArr = string.split('-');
  if (stringArr.length > 1) {
    let returnString = '';
    stringArr.forEach((element) => {
      returnString += element.charAt(0).toUpperCase() + element.slice(1) + ' ';
    });
    return returnString;
  } else {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};
export default capitalizeFirstLetter;
