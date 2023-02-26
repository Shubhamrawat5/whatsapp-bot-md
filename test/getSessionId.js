require("dotenv").config();
let { igApi, getCookie } = require("insta-fetcher");
const main = async () => {
  try {
    // const username = process.env.usernameIG;
    // const password = process.env.passwordIG;
    // const session_id = await getCookie(username, password);
    const session_id = process.env.session_id;
    console.log(session_id);
  } catch (error) {
    console.log(error);
  }
};
main();
