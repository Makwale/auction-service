"use strict";

module.exports.createAuction = (event, context) => {
    console.log(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'hello auction'})
    }
}
