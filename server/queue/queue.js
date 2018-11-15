'use strict';
const timers = require('timers');
const _ = require('lodash');
const moment = require('moment');
const Job = require('./../models/jobModel');
let scheduler = {};
function execJobs(when, ioEmitter) {
    const jobsIds = _.get(scheduler, `${when}.jobs`);
    if (!_.isEmpty(jobsIds)) {
        return Job.findActiveByIds(jobsIds).then((jobs) => {
            return _.sortBy(jobs, 'priority').reduce(function (prevPromise, job) {
                return prevPromise = prevPromise.then(() => {
                    console.log(`running job ${job.name} at ${moment(when)}`);
                    return Job.complete(job.id).then(ioEmitter.jobUpdated);
                });
            }, Promise.resolve());
        }).then(() => {
            scheduler = _.omit(scheduler, when);
            return Promise.resolve();
        }).catch(ioEmitter.error);
    }
    scheduler = _.omit(scheduler, when);
    return Promise.resolve();

}
module.exports = function (ioEmitter) {
    return {
        addScheduler(job) {
            const {id, date} = job;
            const when = moment(date).valueOf();
            const duration = when - moment().valueOf();
            let plan = _.get(scheduler, when);
            if (!plan) {
                plan = {jobs: [id], handler: timers.setTimeout(() => execJobs(when, ioEmitter), duration)};
                _.set(scheduler, when, plan);
            } else {
                if (!_.includes(plan.jobs, id)) {
                    plan.jobs.push(id);
                }
            }
        },

        removeScheduler(job) {
            const {id, date} = job;
            const when = moment(date).valueOf();
            const plan = _.get(scheduler, when);
            const jobs = _.get(plan, 'jobs');
            const handler = _.get(plan, 'jobs');
            _.pull(jobs, [id]);
            if (_.isEmpty(jobs) && handler) {
                timers.clearTimeout(handler);
                scheduler = _.omit(scheduler, when);
            }
        }
    };
};

