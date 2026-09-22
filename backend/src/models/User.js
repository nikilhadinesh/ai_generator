const dynamoDB = require('../config/aws');

const TABLE_NAME = 'Users';

async function createUser({ email, hashedPassword, name }) {
  const item = {
    email,
    password: hashedPassword,
    name: name || '',
    createdAt: new Date().toISOString(),
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
    ConditionExpression: 'attribute_not_exists(email)', // duplicate email prevent pannum
  }).promise();

  return item;
}

async function getUserByEmail(email) {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: { email },
  }).promise();

  return result.Item;
}

module.exports = { createUser, getUserByEmail };