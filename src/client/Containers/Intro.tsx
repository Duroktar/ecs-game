import * as React from 'react';
import { Layout } from '../Layouts/Base';

interface Props {
  onPlayerInput: (ev: KeyboardEvent) => void;
}

export class Intro extends React.Component<Props> {

  componentDidMount() {
    document.addEventListener('keypress', this.props.onPlayerInput);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.props.onPlayerInput);
  }

  render() {
    return (
      <Layout id="intro" className="game-screen">
        Fancy stuff here (Intro)
      </Layout>
    )
  }
}
