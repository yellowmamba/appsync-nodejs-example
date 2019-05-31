const fetch = require('node-fetch')
const AWS = require('aws-sdk')
const URL = require('url')
const aws4 = require('aws4')
const awscred = require('awscred')
const util = require('util')

exports.handler = async (event, context) => {
    console.log(event)
    return `First: Todo ID is: ${event.data.todoId}`
}

exports.handler2 = async (event, context) => {
    console.log(event)
    return `${event.description}
    Second: This is a second line of description`
}

exports.postCognitoAuth = async (event, context) => {
  console.log('This is triggered by Cognito PostAuthentication')
  console.log('Event payload', event)
  console.log('Env vars', process.env)

  const loader = util.promisify(awscred.load)
  const data = await loader()

  const addTodo = `mutation addPrivateTodo($id: ID!, $name: String) {
    addTodo(id: $id, name: $name) {
      id,
      name
    }
  }`

  const details = {
    id: `${Date.now()}`,
    name: 'my private todo'
  }

  const postBody = {
    query: addTodo,
    operationName: 'addPrivateTodo',
    variables: details
  }

  const uri = URL.parse(process.env.GRAPHQL_API_ENDPOINT)

  const options = {
    host: uri.host,
    path: uri.path,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    region: "ap-southeast-2",
    service: "appsync",
    body: JSON.stringify(postBody)
  }

  console.log(`Posting...`, JSON.stringify(postBody, null, 2))

  const result = await fetch(uri.href, aws4.sign(options, data.credentials))
  console.log(result)
  
  console.log('After fetch operation is done!')

  return event
}