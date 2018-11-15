import React from "react";
import moment from "moment";
import io from "socket.io-client";
import {connect} from 'react-redux';
import AddNewJobForm from './AddNewJobForm';
import {jobAdded, jobUpdated, jobDeleted, jobsLoaded, getJobsRequest,
	addNewJobRequest, updateJobRequest, deleteJobRequest} from '../actions/action';


let socket;
let completedStyle = {
  textDecoration: "line-through"
};
const mapStateToProps = (state = {}) => {
    return {...state};
};

export  class Layout extends React.Component{
   constructor(props)
   {
	   super(props);
	   const {dispatch} = this.props;
	   socket = io.connect("http://localhost:3000");
	   dispatch(getJobsRequest(socket));
	   socket.on('jobsLoaded',(jobs)=> {
		   dispatch(jobsLoaded(jobs));
	   });
	   socket.on('jobAdded',(job)=> {
		   dispatch(jobAdded(job))
	   });

	   socket.on('jobUpdated',(job)=> {
		   dispatch(jobUpdated(job))
	   });
	   socket.on('jobDeleted',(id)=> {
		   dispatch(jobDeleted(id))
	   });
	   socket.on('error',(err)=> {
		   alert(err);
	   });
	   this.addJob = this.addJob.bind(this);
	   this.updateJob = this.updateJob.bind(this);
	   this.deleteJob = this.deleteJob.bind(this);
   }
	updateJob(job){
		const {dispatch} = this.props;
		dispatch(updateJobRequest(socket, job));
	}
	deleteJob(id){
		const {dispatch} = this.props;
		dispatch(deleteJobRequest(socket, id));
	}
	addJob(job){
		const {dispatch} = this.props;
		dispatch(addNewJobRequest(socket, job));
	}
   componentWillUnmount() {
       socket.disconnect();
   }

   render(){
       const {jobs} = this.props;
        const nodes = jobs.sortBy((job) => job.date + job.priority).map((job, key)=> {
            const deleteBtn = job.status === 0 ? (<button onClick={() => this.deleteJob(job.id)}>delete</button>): '';

            return (
                <li key={key} style={job.status === 2 ? completedStyle : {}}>
					<span className='jobs-col'>{job.name}</span>
					<span className='jobs-col'>{moment(job.date).format('HH:mm')}</span>
					<span className='jobs-col'>{job.priority}</span>
					{deleteBtn}
                </li>);
        });
		return (
			<div>
				<h1>Add new Jobs</h1>
					<AddNewJobForm submitAction={this.addJob}/>
				<h1>Jobs</h1>
				<ul className='jobs'>{nodes}</ul>
			</div>
		);
	}
}

export default  connect(mapStateToProps)(Layout);