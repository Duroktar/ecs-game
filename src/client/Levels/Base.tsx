import * as React from 'react';

export class Level extends React.Component {
  render() {
    return (
      <div className="screen level">
        {this.props.children}
      </div>
    );
  }
}
