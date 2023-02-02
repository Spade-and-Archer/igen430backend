import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import {apiRouter} from "./router";
import { mongoose } from "@typegoose/typegoose";
const app = express;

export async function runServer(port: number): Promise<void> {
    // Load env vars
    dotenv.config();
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

    app.listen(port, () => {
        console.log(`App is listening on port: ${port}`);
    });
}

const port = process.env.PORT || 4010;
(async () => {
    await runServer(port as number);
})();
