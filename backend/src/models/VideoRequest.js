const dynamoDB = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Create new video request
async function createVideoRequest({ userId, type, prompt }) {
  const item = {
    requestId: uuidv4(),
    userId: userId || 'guest',
    type,               // "text" or "image"
    prompt: prompt || '',
    status: 'pending',  // pending | processing | done | failed
    videoUrl: '',
    createdAt: new Date().toISOString(),
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

// Get a single request by ID
async function getVideoRequest(requestId) {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: { requestId },
  }).promise();

  return result.Item;
}

// Update status/videoUrl
async function updateVideoRequest(requestId, updates) {
  const updateExpr = [];
  const exprValues = {};
  const exprNames = {};

  for (const key in updates) {
    updateExpr.push(`#${key} = :${key}`);
    exprValues[`:${key}`] = updates[key];
    exprNames[`#${key}`] = key;
  }

  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: { requestId },
    UpdateExpression: `SET ${updateExpr.join(', ')}`,
    ExpressionAttributeNames: exprNames,
    ExpressionAttributeValues: exprValues,
  }).promise();
}

module.exports = { createVideoRequest, getVideoRequest, updateVideoRequest };