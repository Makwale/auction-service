const AWS = require('aws-sdk');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionHandler(event) {
    const { id } = event.pathParameters;
    let auction;
    try {
       const results = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {id}
        }).promise();
        auction = results.Item;
    } catch( error ) {
        createError.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({auction, id, params: event.pathParameters})
    };
}

export const getAuction = middy(getAuctionHandler)
.use(httpJsonBodyParser()) //to auto parse stringfied object of body from event object
.use(httpEventNormalizer())
.use(httpErrorHandler()); // for error handling using http-errors package