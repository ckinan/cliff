exports.handler = async function (event) {
  const name = event.queryStringParameters.name;
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ greet: `Hello ${name}` }),
    };
  } catch (err) {
    return {
      statusCode: err.code ? err.code : 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
