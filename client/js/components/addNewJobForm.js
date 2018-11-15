import React, { Component } from "react";
import moment from "moment";
import PropTypes from 'prop-types';

export default class AddNewJobForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            date: moment().add(1, 'minute').format('HH:mm'),
            priority: 1
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event){
        const {submitAction} = this.props;
        const {name, date, priority} = this.state;
        event.preventDefault();
        submitAction({name, date: moment(date, 'HH:mm'), priority});
    }
    handleChange(event){
        this.setState({
          [event.target.name]: event.target.value
        });
    }
    render() {
        const {state} = this;
        return (<div>
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>name</label>
                    <input type="text" onChange={this.handleChange} name="name"  value={state.name}></input>
                </div>
                <div>
                    <label>date(HH:mm)</label>
                    <input type="text" onChange={this.handleChange} name="date" value={state.date}></input>
                </div>
                <div>
                    <label>priority</label>
                   <input type="number" onChange={this.handleChange} name="priority" value={state.priority}></input>
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </div>);
    };
}
AddNewJobForm.propTypes = {
  onSubmit: PropTypes.func
};
AddNewJobForm.defaultProps = { onSubmit(){}};
