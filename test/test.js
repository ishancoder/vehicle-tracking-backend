import db from "../src/db/db";
import expect from "expect.js";
import simulator from "../simulator/simulator"

const URL = "http://localhost:8000"

function getRequestBody(method, requestBody) {
    return {
        method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    };
}

describe("API", function() {
    // Clear the database after and before the test runs.
    before(function() {
        db.clear();
    });

    describe("/add", function() {
        it('Should add a vehicle to the database', async function() {
            const vehicle = {
                type: "CAR",
                lat: 140.5,
                lng: 140.3,
                speed: 20,
            };
            const resp = await fetch(`${URL}/add`, getRequestBody("PUT", vehicle)).then(res => res.json());
            expect(resp.status).to.be("SUCCESS");
            expect(resp.data).to.have.keys(["id", "type", "lat", "lng", "speed", "lastMoved", "lastUpdated"]);
        });

        it('Should have the vehicle in memory after adding', async function() {
            const resp = await fetch(URL).then(res => res.json());
            expect(resp.status).to.be("SUCCESS");
            expect(resp.data.length).to.be(1);
        });
    });

    describe("/update", function() {
        it('Should update a vehicles data properly', async () => {
            const getResponse = await fetch(URL).then(res => res.json());
            expect(getResponse.status).to.be("SUCCESS");
            expect(getResponse.data.length).to.be(1);
            expect(getResponse.data[0]).to.have.property("id");

            const {data: [{id}]} = getResponse; // Getting the id of the added vehicle 

            const updatedData = {
                lat: 151,
                lng: 152,
                speed: 40
            };
            
            const resp = await fetch(`${URL}/update/${id}`, getRequestBody("POST", updatedData)).then(res =>  res.json());
            expect(resp.status).to.be("SUCCESS");
            
            Object.keys(updatedData).forEach(key => {
                expect(resp.data[key]).to.be(updatedData[key]);
            });
        });
    });


    describe("SIMULATION", function() {
        before(function() {
            db.clear();
        });
        
        after(function() {
            db.clear();
        });
        
        it('Should run the simulation', function(done) {
            this.timeout(150000);
            simulator.init();
            const updationTimeout = simulator.run();
            setTimeout(function() {
                clearTimeout(updationTimeout);
                done();
            }, 120000);
        });
    });
});