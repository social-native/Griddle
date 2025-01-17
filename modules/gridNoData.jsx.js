/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var React = require('react');
var createReactClass = require('create-react-class');

var GridNoData = createReactClass({
    getDefaultProps: function getDefaultProps() {
        return {
            "noDataMessage": "No Data"
        };
    },
    render: function render() {
        var that = this;

        return React.createElement('div', null, this.props.noDataMessage);
    }
});

module.exports = GridNoData;
