//Survey new -> Survey form -> Survery field(s)

import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '.5em' }} />
            <div className="red-text" style={{ marginBottom: '1em' }}>{touched && error}</div>
        </div>
    );
};