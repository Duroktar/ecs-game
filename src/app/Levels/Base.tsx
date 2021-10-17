import * as React from 'react';

export class Level extends React.PureComponent {
  render() {
    return (
      <div className="screen level">
        {this.props.children}
      </div>
    );
  }
}
