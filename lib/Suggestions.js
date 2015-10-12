var React = require('react');

// determines the min query length for which 
// suggestions are displayed
const MIN_QUERY_LENGTH = 1;

var Suggestions = React.createClass({
    propTypes: {
        query: React.PropTypes.string.isRequired,
        selectedIndex: React.PropTypes.number.isRequired,
        suggestions: React.PropTypes.array.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        handleHover: React.PropTypes.func.isRequired
    },
    markIt: function(input, query) {
        return {
          __html: input.split(query.trim()).join("<mark>" + query.trim() + "</mark>")
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (prevProps.selectedIndex > -1) {
            var el = React.findDOMNode(this).querySelector('ul');
            var activeEl = el.querySelector('.active');
            if (el && activeEl) {
                var scrollTop = el.scrollTop;
                var scrollBottom = scrollTop + el.offsetHeight;

                var elemTop = activeEl.offsetTop;
                var elemBottom = elemTop + activeEl.offsetHeight;

                var isVisible = ((elemBottom <= scrollBottom) && (elemTop >= scrollTop));

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

    render: function() {
        var props = this.props;
        var suggestions = this.props.suggestions.map(function(item, i) {
            return (
                <li key={i} 
                    onClick={props.handleClick.bind(null, i)}
                    onMouseOver={props.handleHover.bind(null, i)}
                    className={i == props.selectedIndex ? "active" : ""}>
                    <span dangerouslySetInnerHTML={this.markIt(item, props.query)} />
                 </li>
            )
        }.bind(this));

        if (suggestions.length === 0 || props.query.length < MIN_QUERY_LENGTH) {
            return <div className="ReactTags__suggestions"> </div>
        }

        return (
            <div className="ReactTags__suggestions">
                <ul> { suggestions } </ul>
            </div>
        )
    }
});

module.exports = Suggestions;
