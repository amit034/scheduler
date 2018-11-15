import {List} from 'immutable';

let id = 0;
const initialState = { jobs:List([])};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'JOB_ADDED':
        return {
            ...state,
            jobs:state.jobs.push(action.job)
        };
    case 'JOB_UPDATED':
        return {
            ...state,
            jobs: state.jobs.update(
                state.jobs.findIndex(function (job) {
                    return job.id === action.job.id;
                }), function () {
                    return action.job;
                })
        };
    case 'JOB_DELETED':
      return {
          ...state,
          jobs: state.jobs.filter(job => job.id !== action.id)
      };
    case 'JOBS_LOADED':
    return {
        ...state,
        jobs:List(action.jobs)
      };
    default:
      return state
  }
};

export default reducer;