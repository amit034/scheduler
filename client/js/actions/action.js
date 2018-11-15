export const jobAdded = (job) => ({
	type: "JOB_ADDED",
	job
});

export const jobUpdated = (job) => ({
	type: "JOB_UPDATED",
	job,
});
export const jobDeleted = (id) => ({
	type: "JOB_DELETED",
	id,
});


export const jobsLoaded = (jobs) => ({
	type: "JOBS_LOADED",
	jobs
});

export const getJobsRequest = (socket) => {
	return () => {
	    socket.emit('loadJobs');
	}
};
export const addNewJobRequest = (socket, job) => {
	return () => {
	    socket.emit('addJob',job);
	}
};
export const updateJobRequest = (socket, job) => {
	return () => {
	    socket.emit('updateJob',job);
	}
};
export const deleteJobRequest = (socket, id) => {
	return () => {
	    socket.emit('deleteJob',id);
	}
};

