# Vehicle Tracking Backend.

## Motivation
This Project is made in order to complete a programming challenge. The motive for this is to create a web application which can show a company's vehicle data in real time on a DashBoard. This is the **BACKEND** part of the application. You can find the companion frontend for the **DASBOARD** [here](https://github.com/ishancoder/vehicle-tracking-fronend).

## Assumptions
1. The vehicle will have a GPS which is going to be responsible for sending the corrent Longitude, Latitude and Speed of the vehicle.
2. We will only consider a vehicle moving if it's Longitude and/or Latitude changes. No matter what the vehicle is sending in the speed we will not consider it moving as long as it's Latitude and/or Longitude not changes.
3. If the vehicle is new it should call appropriate `/add` api end point to register itself with the Backend.
4. Vehicle should send it's updated Latitude, Longitude, Speed in every 4-5 seconds.

## Implementation
There is so much to talk about in this section but I'll try to keep it simple.

### Building Blocks
There are three major building blocks of the backend

1. The Store
2. APIs
3. WebSockets

### 1. The Store
For simplicity we're storing all the vehicle data in memory but If you want to use something more prominent like Redis, DynamoDB, MongoDB, Firebase or MySQL you can add it easily just go ahead and implement the methods to fetch the data correctly in the `src/db/db.js` file. 

### 2. APIs
According to our first assumption there is going to be a way by which the GPS will send information to us. These APIs will provide that medium to the GPS to send the information to us.
All of the implementation for the APIs are in `src/app.js` file. For the most part the API saves the new/updated data to the store and emits an even on the WebSocket to aware the frontend of the changes.

There are three API routes for the corresponding data.

1. `GET /` - To get the list of all the vehicles with speed, latitude and longitude on the time when the request is made.

2. `PUT /add` - To register a new vehicle with the Backend.    

    Sample Requst Body
    ```
    {
        type: String, // [BUS, TRUCK, CAR, BIKE]
        lat: Float, // 20.1234
        lng: Float, // 40.4321
        speed: Integer // 60 in KMPH
    }
    ```
3. `POST /update/:vehicleId` - To Update the vehicles Latitude, Longitude and Speed. If anyone want's to change the store to a proper DATABASE make sure this API stays fast because this is the heart and soul of the system and this API is going to be called multiple times.

    Sample Request Body
    ```
    {
        last: Float, // 20.1234,
        lng: Float, // 20.4321,
        speed: Integer // 75 in KMPH
    }
    ```

### 3. WebSockets (Using Socket.io)
There are two ways to update data on the **DASHBOARD** in real time. 

First make your frontend `GET /` in every now and then. Then get the data see what's changed and update the UI but it's as inefficient as it sounds.

Second setup a WebSocket and whenever the dashboard loads it connects with the backend using that WebSocket and every time there's a change we'll only going to deliver the changes to the **DASHBOARD** (Data flow from BACKEND to FRONTEND).

The WebSocket is setup using [Socket.io](https://socket.io) & it relies on three events.

1. `initial-data` - Sends the initial data to render the DASHBOARD on connection.
2. `new-vehicle` - Sends the newly added vehicle to the DASHBOARD.
3. `update` - Sends the changes to the DASHBOARD.

If you want to know more how the DASHBOARD responds to these events and update the view. Check out [https://github.com/ishancoder/vehicle-tracking-fronend](https://github.com/ishancoder/vehicle-tracking-fronend)

## Technologies Used
1. `Node.js` for the JavaScript RunTime.
2. `Express.js` for the Server.
3. `cors` for enabling cross origin requests.
4. `uuid` for generating unique ids for vehicles.
5. `Socket.io` for emiting events.

## How to get this thing Running Locally.
Simple enough. Follow along

1. `git clone` or download the repository.
2. `cd` into the directory.
4. Run `npm install` or `yarn` (If you're using it)
5. Let the dependencies download.
6. Run `npm serve` or `yarn serve`
7. The Server will start running on [**http://loclhost:8000**](http://loclhost:8000)


## Thanks for Reading 😊
