'use strict'

const aws_exports = require('./aws-exports').default

const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
const AWSAppSyncClient = require('aws-appsync').default
const gql = require('graphql-tag')
require('isomorphic-fetch')

const url = aws_exports.APPSYNC_URL
const region = aws_exports.REGION
const auth_type = AUTH_TYPE.API_KEY
const api_key = aws_exports.API_KEY

const AWS = require('aws-sdk')
AWS.config.update({
    region: region,
})
const credentials = AWS.config.credentials

const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
        type: auth_type,
        apiKey: api_key,
    },
    disableOffline: true
})

// construct a query that conforms to the AppSync schema
const query = gql(`
	query ListEvents {
		listEvents {
			items {
				id
				description
			}
			nextToken
		}
	}
`)

client.hydrated().then(function (client) {
    //Now run a query
    client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
        .then(function logData(data) {
            console.log('results of query: ', JSON.stringify(data, null, 4))
        })
        .catch(console.error)
})
