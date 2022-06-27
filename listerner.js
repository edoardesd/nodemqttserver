
// Imports
const fs = require('fs');
const mqtt = require('mqtt');
const Jimp = require("jimp");

// Global variables
const LOCAL_DIR_TO_COPY_TO = "/home/ubuntu/raw_field_data";
const TOPIC_TO_SUBSCRIBE_TO = "smart/parking/polimi";
const HOST = "broker.hivemq.com"

const clientId = `parking_${Math.random().toString(16).slice(3)}`

const client = mqtt.connect('mqtt://'+HOST, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});


client.on('connect', function() {
    client.subscribe(TOPIC_TO_SUBSCRIBE_TO, () => {
        console.log('Subscribed to ', TOPIC_TO_SUBSCRIBE_TO);
    });
});

client.on("connect", function(){
	console.log("Client connected");
});


client.on('message', function(topic, payload) {
    console.log('Message received on', topic);

    if (topic === TOPIC_TO_SUBSCRIBE_TO) {
        console.log('message::' + TOPIC_TO_SUBSCRIBE_TO);
        // Reads file in form buffer => <Buffer ff d8 ff db 00 43 00 ...
        // const buffer = fs.readFileSync("path-to-image.jpg");
        // Pipes an image with "new-path.jpg" as the name.
        fs.writeFileSync("new-path.jpg", payload);
    }
});

client.on('error', (error) => {
    console.log(error)
})
