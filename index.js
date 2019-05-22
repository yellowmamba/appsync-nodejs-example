exports.handler = async (event, context) => {
    console.log(event)
    console.log(context)
    return event.data
}