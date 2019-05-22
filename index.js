exports.handler = async (event, context) => {
    console.log(event)
    return `First: Todo ID is: ${event.data.todoId}`
}

exports.handler2 = async (event, context) => {
    console.log(event)
    return `${event.description}
    Second: This is a second line of description`
}