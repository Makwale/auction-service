const AWS = require('aws-sdk');
const {v4: uuid} = require('uuid');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuctionHandler (event, context){
    const { title } = event.body;
    if(!title){
        throw new createError.BadRequest();
    }
    const now = new Date();
    let endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
        id: uuid(),
        title,
        createdAt: new Date().toISOString(),
        endDate: endDate.toISOString(),
        status: 'OPEN',
        highestBid: {
            amount: 0,
        }
    };

    try{
        await dynamodb.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction
        }).promise();
    } catch(error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify({ auction})
    };
}

export const createAuction = middy(createAuctionHandler)
.use(httpJsonBodyParser()) //to auto parse stringfied object of body from event object
.use(httpEventNormalizer())
.use(httpErrorHandler()); // for error handling using http-errors package