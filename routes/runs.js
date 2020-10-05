const express = require("express");
const router = express.Router();
const {ensureAuth} = require("../middleware/auth");

const Run = require("../models/Run");

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

        let run = {
            user: req.user.id,
            miles: miles,
            mph: mph,
            notes: notes,
            caloriesBurnt: calories
        };

        let theRun = await Run.create(run);

        res.status(200).send({
            message: "run successfully created",
            id: theRun._id,
            caloriesBurnt: calories
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

        const run = await Run.findOne({_id: runId});

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
        await Run.deleteOne({_id: req.params.id});
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
        console.log('here?');
        let runs = await Run.find({user: req.user.id});
        res.status(200).send({
            message: "runs successfully obtained",
            runs: runs,
        });
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: "runs could not be obtained"
        });
    }
});

module.exports = router;
