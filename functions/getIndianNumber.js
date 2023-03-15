module.exports.getIndianNumber = async (body) => {
  const indianNumbRegex =
    /(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})/g;

  const result = body.match(indianNumbRegex);
  let number = result[0];

  if (!number) return "";

  //remove spaces
  number = number.replaceAll(" ", "");

  //check if + is there
  if (number.startsWith("+")) number = number.slice(1);

  //check if 91 is there
  if (number.length === 10) number = "91" + number;

  console.log("number:", number);
  if (number.length === 12) return number;
  else return "";
};
