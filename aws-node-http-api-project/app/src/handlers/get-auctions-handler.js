const AWS = require('aws-sdk');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionsHandler(event) {
    let auctions;
    try {
       const results = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise();
        auctions = results.Items;
        console.log(auctions);
    } catch( error ) {
        createError.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({auctions})
    };
}

export const getAuctions = middy(getAuctionsHandler)
.use(httpJsonBodyParser()) //to auto parse stringfied object of body from event object
.use(httpEventNormalizer())
.use(httpErrorHandler()); // for error handling using http-errors package