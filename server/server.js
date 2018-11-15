const express = require('express');
const _ = require('lodash');

const bodyParser = require('body-parser');
const http = require('http');
const socketServer = require('socket.io');
const Job = require('./models/jobModel');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const serve = http.createServer(app);
const io = socketServer(serve);
const ioEmitter = require('./emiters/ioEmiter')(io);
const queue = require('./queue/queue')(ioEmitter);
io.on('connection', function (socket) {
        const id = socket.id;
        console.log(`socket ${id} connected`);
        socket.on('disconnect', () => {
            console.log(`socket ${id} disconnected`);
        });
        socket.on('loadJobs', () => {
            return Job.findActive()
            .then(ioEmitter.jobsLoaded)
            .catch(ioEmitter.error);
        });
        socket.on('addJob', (data) => {
            return Job.create(data)
            .then((job) => {
                queue.addScheduler(job);
                return job;
            })
            .then(ioEmitter.jobAdded)
            .catch(ioEmitter.error);
        });
        socket.on('deleteJob', (id) => {
            return Job.destroy(id).then((job) => {
                queue.removeScheduler(job);
               return id;
             })
            .then(ioEmitter.jobDeleted)
            .catch(ioEmitter.error);
        });
});
serve.listen(3000, () => {
    console.log('Running...');
    return Job.findActive().then((jobs) => {
        _.forEach(jobs, queue.addScheduler);
    });
});

