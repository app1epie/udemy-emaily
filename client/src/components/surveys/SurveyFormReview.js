import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

//constructor can retrieve props[formValues] from export connect(function())
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {

    const reviewFields = _.map(formFields, ({ name, label }) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        );
    });

    return (
        <div>
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <button
                className="yellow white-text darken-3 btn-flat"
                onClick={onCancel}>
                Back
            </button>
            <button
                onClick={() => submitSurvey(formValues, history)}
                className="green btn-flat white-text right">
                Send Survey
                <i className="material-icons right">email</i>
            </button>
        </div >
    );
};

//return values from store as props to the component
function mapStateToProps(state) {
    //get surveryform valuse from react-redux store
    return {
        formValues: state.form.surveyForm.values
    };
}

//configure store -> props -> component here
//2nd parameters, actions, hookup action creator to connect
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));