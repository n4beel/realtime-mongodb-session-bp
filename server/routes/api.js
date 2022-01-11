const Task = require('../models/task');
const express = require('express');
const router = express.Router();

/* GET ALL TASK */
router.get('/all', async (req, res) => {
    let tasks = []

    try {
        tasks = await Task.find({})
        console.log("tasks", tasks)

        res.status(200).json(tasks);

    } catch (err) {
        console.log('FETCH Error: ' + err);
        res.status(500).send('Error');
    }
});

/* CREATE TASK */
router.post('/new', (req, res) => {
    Task.create({
        task: req.body.task,
    }, (err, task) => {
        if (err) {
            console.log('CREATE Error: ' + err);
            res.status(500).send('Error');
        } else {
            res.status(200).json(task);
        }
    });
});

/* DELETE TASK*/
router.route('/:id')
    .delete((req, res) => {
        Task.findById(req.params.id, (err, task) => {
            if (err) {
                console.log('DELETE Error: ' + err);
                res.status(500).send('Error');
            } else if (task) {
                task.remove(() => {
                    res.status(200).json(task);
                });
            } else {
                res.status(404).send('Not found');
            }
        });
    });

module.exports = router;