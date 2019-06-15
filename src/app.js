import http from 'http';
import socket from 'socket.io';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import db from './db/db'


const logger = morgan('tiny');
const PORT = 8000;

// Setup socket and server
const app = express();
const server = http.createServer(app);
const io = socket(server);
io.origins('*:*')

app.use(logger);
app.use(bodyParser.json());

// Allowing every origin for now.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', async (req, res) => {
    try {
        const result = await db.getAllVehicles();
        res.json(result);
    } catch(err) {
        res.status(500).json(err);
    }
});


app.put('/add', async (req, res) => {
    const {type, lat, lng, speed} = req.body;
    if(!type || lat == null || lng == null || speed == null) {
        res.status(400).json({err: "Make sure your request have 'type', 'speed', 'lat' and 'lng'"})
        return;
    }

    try {
        const result = await db.addNewVehicle(type, lat, lng, speed);
        io.emit('new-vehicle', result.data);
        res.json(result);
    } catch(err) {
        res.json(err);
    }
});

app.post('/update/:vehicleId', async (req, res) => {
    const {vehicleId} = req.params;
    const {lat, lng, speed} = req.body;
    if(lat == null || lng == null || !vehicleId || speed == null) {
        res.status(400).json({
            err: "Make sure your request have 'lat', 'lng', 'speed' and there should be a 'vehicleId' in URL params"
        });
        return;
    }

    try {
        const result = await db.updatePosition(vehicleId, lat, lng, speed);
        io.emit('update', result.data);
        res.json(result);
    } catch(err) {
        res.status(500).json(err);
    }
});

io.on("connection", async () => {
    const result = await db.getAllVehicles();
    if(result.status === "SUCCESS")
        io.emit('initial-data', result.data);
});


server.listen(PORT, () => console.log(`App is running on port : ${PORT}`));