import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import {apiRouter} from "./router";
import { mongoose } from "@typegoose/typegoose";
import firstTest from "./BasicConfigs/FirstTest";
import {MongoMemoryReplSet} from "mongodb-memory-server";
import dgram from "dgram";
const controller = new AbortController();
const { signal } = controller;
const app = express;

export async function runServer(port: number): Promise<void> {
    // Load env vars
    dotenv.config();
    await connectToEmpty()
    // Initiate app functions
    // Set up express
    const app = express();

    app.use(cors());
    app.use(json());

    app.use(urlencoded({ extended: true }));
    app.use("/api", apiRouter);

    app.use("/hello/", function (req, res) {
        return res.send("Andromeda Backend Server v5");
    });
    await firstTest();
    app.listen(port, () => {
        console.log(`App is listening on port: ${port}`);
    });


    const server = dgram.createSocket({ type: 'udp4', signal });
    server.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });
    server.bind(4012);
    console.log("udp is active on port 4012");
}

const port = process.env.PORT || 4010;
(async () => {
    await runServer(port as number);
})();

async function connectToEmpty(){
    const replSet = await MongoMemoryReplSet.create({
        replSet: { storageEngine: "wiredTiger" },
        instanceOpts: [
            {
                args: ["--enableMajorityReadConcern=false"],
            },
        ],
    });
    const uri = replSet.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    };
    await mongoose.connect(uri, mongooseOpts);
}


async function connectToLocal(){
    mongoose.connect(
        'mongodb://127.0.0.1:27017', {
            useNewUrlParser: true,
            dbName: "test_data",
            reconnectTries: 100,
            reconnectInterval: 300,
        },
        function (error) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log("Connection to local dataset established");
        }
    );
}