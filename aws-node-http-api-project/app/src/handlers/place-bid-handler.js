const AWS = require('aws-sdk');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBidHandler(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount
        },
        ReturnValues: 'ALL_NEW'
    };
    let updatedAuction;
    try{
        const results = await dynamodb.update(params).promise();
        updatedAuction = results.Attributes;
        console.log(updatedAuction);
    } catch(error) {
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify({ id, amount })
    };
}

export const placeBid = middy(placeBidHandler)
.use(httpJsonBodyParser()) //to auto parse stringfied object of body from event object
.use(httpEventNormalizer())
.use(httpErrorHandler()); // for error handling using http-errors package