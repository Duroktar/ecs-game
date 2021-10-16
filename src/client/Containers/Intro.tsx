import * as React from 'react';
import { Layout } from '../Layouts/Base';
import { Screens } from '../Screens';

interface Props {
  onPlayerInput: (ev: KeyboardEvent) => void;
  nav:           (screen: Screens) => void;
}

export class Intro extends React.Component<Props> {

  componentDidMount() {
    // document.addEventListener('keypress', this.props.onPlayerInput);
    this.props.nav('menu');
  }

  componentWillUnmount() {
    // document.removeEventListener('keypress', this.props.onPlayerInput);
  }

  render() {
    return (
      <Layout id="intro" className="game-screen">
      </Layout>
    )
  }
}
