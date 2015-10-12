"use strict";

var React = require('react');

// determines the min query length for which
// suggestions are displayed
var MIN_QUERY_LENGTH = 1;

var Suggestions = React.createClass({
    displayName: "Suggestions",

    propTypes: {
        query: React.PropTypes.string.isRequired,
        selectedIndex: React.PropTypes.number.isRequired,
        suggestions: React.PropTypes.array.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        handleHover: React.PropTypes.func.isRequired
    },
    markIt: function markIt(input, query) {
        return {
            __html: input.split(query.trim()).join("<mark>" + query.trim() + "</mark>")
        };
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedIndex > -1) {
            var el = React.findDOMNode(this).querySelector('ul');
            var activeEl = el.querySelector('.active');
            if (el && activeEl) {
                var scrollTop = el.scrollTop;
                var scrollBottom = scrollTop + el.offsetHeight;

                var elemTop = activeEl.offsetTop;
                var elemBottom = elemTop + activeEl.offsetHeight;

                var isVisible = elemBottom <= scrollBottom && elemTop >= scrollTop;

                if (!isVisible) {
                    if (elemTop >= scrollBottom) {
                        // element is below scroll window, so align bottom
                        el.scrollTop = elemTop + el.offsetHeight - activeEl.offsetHeight;
                    } else {
                        // element is above the scroll window, so align top
                        el.scrollTop = elemTop;
                    }
                }
            }
        }
    },

    render: function render() {
        var props = this.props;
        var suggestions = this.props.suggestions.map((function (item, i) {
            return React.createElement(
                "li",
                { key: i,
                    onClick: props.handleClick.bind(null, i),
                    onMouseOver: props.handleHover.bind(null, i),
                    className: i == props.selectedIndex ? "active" : "" },
                React.createElement("span", { dangerouslySetInnerHTML: this.markIt(item, props.query) })
            );
        }).bind(this));

        if (suggestions.length === 0 || props.query.length < MIN_QUERY_LENGTH) {
            return React.createElement(
                "div",
                { className: "ReactTags__suggestions" },
                " "
            );
        }

        return React.createElement(
            "div",
            { className: "ReactTags__suggestions" },
            React.createElement(
                "ul",
                null,
                " ",
                suggestions,
                " "
            )
        );
    }
});

module.exports = Suggestions;