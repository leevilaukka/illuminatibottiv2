module.exports = async (client, connection) => {
    console.log('Stream has finished playing!');
    connection.disconnect();
};