const AWS = require('aws-sdk');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function processAuctionHandler(event, context) {
    const id = "3712b956-b951-4f2f-a84a-a78bd1a61153";
    const amount = Math.floor(Math.random() * (100 - 50)) + 50;
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

export const processAuction = processAuctionHandler;