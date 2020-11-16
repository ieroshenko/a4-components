const AWS = require('aws-sdk');
const express = require("express");
const router = express.Router();
const {ensureAuth} = require("../middleware/auth");
const uuid = require('uuid');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const calculateCalories = (miles, mph) => {
    return miles * 100 + mph * 3;
};

// @desc add new run
// @route POST /api/runs
router.post("/", ensureAuth, async (req, res) => {
    try {
        let miles = parseInt(req.body.miles);
        let mph = parseInt(req.body.mph);
        let calories = calculateCalories(miles, mph);
        let notes = req.body.notes;

        const runId = uuid.v1();

        const params = {
            TableName: 'Runs',
            Item: {
                RunId: runId,
                miles: miles,
                mph: mph,
                notes: notes,
            }
        };

        docClient.put(params, (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else {
                console.log('data', data);
                const {items} = data;
                console.log(data);

                console.log(items);

                res.status(200).send({
                    message: "run successfully created",
                    id: runId,
                    caloriesBurnt: 0
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: "run could not be added"
        });
    }
});

// @desc update existing run if any
// @route PUT /api/runs/update
router.put("/update", ensureAuth, async (req, res) => {
    try {

        let runId = req.body.id;

        const run = null;

        if (run) {
            run.miles = parseInt(req.body.miles);
            run.mph = parseInt(req.body.mph);
            run.caloriesBurnt = calculateCalories(run.miles, run.mph);
            run.notes = req.body.notes;

            await run.save();
            res.status(200).send({
                message: "run successfully updated",
                caloriesBurnt: run.caloriesBurnt,
            });
        } else {
            throw new Error("Didn't find run");
        }
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: "run could not be updated"
        });
    }
});

// @desc delete existing run
// @route DELETE /api/runs/:id
router.delete("/:id", ensureAuth, async (req, res) => {
    try {

        res.status(200).send({
            message: "run successfully deleted",
        });
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: "run could not be deleted"
        });
    }
});

// @desc get all runs
// @route GET /api/runs
router.get("/", ensureAuth, async (req, res) => {
    try {

        const params = {
            TableName: 'Runs'
        };

        docClient.scan(params, (err, data) => {
            if (err) {
                res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else {
                const {Items} = data;
                res.status(200).send({
                    message: "runs successfully obtained",
                    runs: Items,
                });
            }
        })
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: "runs could not be obtained"
        });
    }
});

module.exports = router;
