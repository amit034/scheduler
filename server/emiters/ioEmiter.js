'use strict';
module.exports = function (io) {
    return {
        error(err) {
            return io.emit('error', err);
        },
        jobsLoaded(jobs) {
            return io.emit('jobsLoaded', jobs);
        },
        jobAdded(job) {
            return io.emit('jobAdded', job);
        },
        jobUpdated(job) {
            return io.emit('jobUpdated', job);
        },
        jobDeleted(id) {
            return io.emit('jobDeleted', id);
        }
    }
};