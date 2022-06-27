const fs = require('fs');
const mqtt = require('mqtt');

// Global variables
const LOCAL_DIR_TO_COPY_TO = "./images/";
const TOPIC_TO_SUBSCRIBE_TO = "smart/parking/polimi/image";
const HOST = "broker.hivemq.com"
const SAVE_EVERY = 300000 //milliseconds

const clientId = `parking_${Math.random().toString(16).slice(3)}`

const client = mqtt.connect('mqtt://'+HOST, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

let buffer;
let timer;
let filename;
let oldFilename = "";



client.on('connect', function() {
    client.subscribe(TOPIC_TO_SUBSCRIBE_TO, () => {
        console.log('Subscribed to ', TOPIC_TO_SUBSCRIBE_TO);
    });
});

client.on("connect", function(){
	console.log("Client connected");
});


client.on('message', function(topic, payload) {
    if (topic === TOPIC_TO_SUBSCRIBE_TO) {
        console.log('message::' + topic);

        buffer = Buffer.from(payload.toString(), "base64");
        filename = getFilename()
    }
});

client.on('error', (error) => {
    console.log(error)
})

saveImagePeriodic()

function saveImagePeriodic() {
    timer = setInterval(function() {
        if (filename != oldFilename) {
            fs.writeFileSync(LOCAL_DIR_TO_COPY_TO + filename, buffer);
            console.log("Pic saved: ", filename);
            oldFilename = filename
        }
        else {
            console.log("warning::pic already saved. Skipping")
        }
    }, SAVE_EVERY);
}

function getFilename() {
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    return year+month+day+"-"+hours+minutes+seconds+".png"
}
