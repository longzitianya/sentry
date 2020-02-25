import React from 'react';
import PropTypes from 'prop-types';

class FunctionName extends React.Component {
  static propTypes = {
    frame: PropTypes.object,
  };

  state = {
    rawFunction: false,
  };

  toggle = event => {
    event.stopPropagation();
    this.setState(({rawFunction}) => ({rawFunction: !rawFunction}));
  };

  render() {
    const {frame, ...props} = this.props;
    const func = frame.function;
    const rawFunc = frame.rawFunction;
    const canToggle = rawFunc && func && func !== rawFunc;

    if (!canToggle) {
      return <code {...props}>{func || rawFunc || '<unknown>'}</code>;
    }

    const current = this.state.rawFunction ? rawFunc : func;
    const title = this.state.rawFunction ? null : rawFunc;
    return (
      <code {...props} title={title}>
        <a onClick={this.toggle}>{current || '<unknown>'}</a>
      </code>
    );
  }
}

export default FunctionName;
