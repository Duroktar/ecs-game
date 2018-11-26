import * as React from 'react';

interface Props {
  updateFrequency?: number;
}

interface State {
  value: number;
}

export class FPS extends React.Component<Props, State> {
  private lastLoop: number = (new Date()).getMilliseconds();
  private count: number = 1;
  private fps: number = 0;
  private throttled: boolean = false;
  private handler: number | undefined;

  static defaultProps = {
    updateFrequency: 500,
  }

  state = {
    value: 0,
  }

  componentDidMount() {
    this.setFps(this.countFps());
    this.loop();
  }

  componentWillUnmount() {
    if (this.handler) {
      cancelAnimationFrame(this.handler)
    }
  }

  countFps = () => {
    const currentLoop = (new Date()).getMilliseconds();
    if (this.lastLoop > currentLoop) {
      this.fps = this.count;
      this.count = 1;
    } else {
      this.count += 1;
    }
    this.lastLoop = currentLoop;
    return this.fps;
  };
  
  loop = () => {
    this.handler = requestAnimationFrame(() => {
      this.setFps(this.countFps());
      this.loop();
    });
  }

  setFps = (value: number) => {
    if (!this.throttled) {
      this.setState({ value })
      this.throttled = true;
      this.handler = setTimeout(() => {
        this.throttled = false;
      }, this.props.updateFrequency)
    }
  }

  render() {
    return (
      <div id="fps">Fps: {this.state.value}</div>
    );
  }
}
