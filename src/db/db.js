import {v4 as uuid} from "uuid";

function vehiclesData() {
    this.store = {};
}

vehiclesData.prototype.getAllVehicles = function() {
    return Promise.resolve({status: "SUCCESS", data: Object.values(this.store)});
};

vehiclesData.prototype.addNewVehicle = function(type, initLat, initLng, initSpeed) {
    const id = uuid();
    this.store[id] = {
        id, 
        type, 
        lat: initLat, 
        lng: initLng, 
        speed: initSpeed, 
        lastMoved: Date.now(), 
        lastUpdated: Date.now()
    };
    return Promise.resolve({status: "SUCCESS", data: {...this.store[id]}});
};

vehiclesData.prototype.updatePosition = function(id, newLat, newLng, speed) {
    if(!this.store[id]) {
        return Promise.reject({status: "FAILED", err: `No Vehicle exists with id: ${id}`});
    }
    const {lat, lng} = this.store[id];
    const lastMoved = (newLat !==  lat || newLng !== lng) ? Date.now() : this.store[id].lastMoved;
    this.store[id] = {...this.store[id], lat: newLat, lng: newLng, speed, lastMoved, lastUpdated: Date.now()};
    return Promise.resolve({status: "SUCCESS", data:{...this.store[id]}});
};

// This method is only going to be useful for testing purposes. Don't call it elsewhere
vehiclesData.prototype.clear = function() {
    this.store = {};
};

const vDB = new vehiclesData();

export default vDB;