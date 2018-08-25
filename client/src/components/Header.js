import React, { Component } from 'react';

//Hooking up component to redux store
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Payments from './Payments';

class Header extends Component {

    //Helper function (custom)
    renderContent() {
        switch (this.props.auth) {
            case null:
                return; //return nothing
            case false:
                return <li><a href="/auth/google">Sign in with Google</a></li>;
            default:
                return [
                    <li key="payment"><Payments /></li>,
                    <li key="balance" style={{ margin: '0 10px' }} >
                        Credits: {this.props.auth.credits}
                    </li>,
                    <li key="signout"><a href="/api/logout">Logout</a></li>
                ];
        }
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper row">
                    <div className="col s12">
                        <Link to={this.props.auth ? '/surveys' : '/'} className="brand-logo">
                            Emaily~
                        </Link>
                        <ul className="right">
                            {this.renderContent()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth }
}

export default connect(mapStateToProps)(Header);