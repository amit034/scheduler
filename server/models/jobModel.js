'use strict';
const _ = require('lodash');
const path = require('path');
const jsonfile = require('jsonfile');
const filePath = path.join(__dirname, '..', 'db', 'jobs_table.json');

const STATUS = {
    NEW: 0,
    RUNNING: 1,
    COMPLETED: 2,
    DELETED: 3
};
function loadTable(){
    return jsonfile.readFile(filePath)
    .catch((err) => {
        console.error(`fail to load data ${err}`);
        return Promise.reject(err);
    });
}
function flushTable(data){
    return jsonfile.writeFile(filePath, data).catch((err) => {
        console.error(`fail to write data  to db${err}`);
        return Promise.reject(err);
    });
}
function getItemFromData(id, data){
    const item = _.get(data, id);
    if (_.isNil(item)){
        return Promise.reject(`job ${id} not found`);
    }
    return Promise.resolve(item);
}
module.exports = {
    STATUS,
    findAll(){
        return loadTable().then((data) => {
            return _.values(data);
        });
    },
    findById(id){
        return loadTable().then((data) => {
            return getItemFromData(id, data);
        });
    },
    findActiveByIds(ids) {
        return loadTable().then((data) => {
            const jobs = _.values(_.pick(data, ids));
            return _.reject(jobs, (job) => _.includes([STATUS.DELETED, STATUS.COMPLETED], job.status));
        });
    },
    create(job){
        return loadTable().then((data) => {
            const id = (_.max(_.map(_.keys(data), _.parseInt)) || 0) + 1;
            const item = _.assign({id, status: STATUS.NEW}, job);
            _.set(data, id, item);
            return flushTable(data).then(() => {
                return item;
            });
        });
    },
    update(id, values){
        return loadTable()
        .then((data) => {
            return Promise.all([
                data,
                getItemFromData(id, data)]);
        }).then(([data, job]) => {
            const updatedJob = _.assign({}, job, values);
            _.set(data, id, updatedJob);
            return flushTable(data).then(() => {
                return updatedJob;
            });
        });
    },
    destroy(id) {
        return module.exports.update(id, {status: STATUS.DELETED});
    },
    complete(id) {
        return module.exports.update(id, {status: STATUS.COMPLETED});
    },
    running(id) {
        return module.exports.update(id, {status: STATUS.RUNNING});
    },
    reset(id) {
        return module.exports.update(id, {status: STATUS.NEW});
    },
    findActive() {
        return module.exports.findAll()
        .then((jobs) => {
            return _.reject(jobs, (job) => _.includes([STATUS.DELETED, STATUS.COMPLETED], job.status));
        });
    }
};