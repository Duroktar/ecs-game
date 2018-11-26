import * as React from 'react';

import { Gui } from '../Layouts/Gui';

function Screen(props: any) {
  return <div className="screen"></div>
}

function Background(props: any) {
  return <div id="black-bg" className="screen"></div>
}

interface Props {
}

export class Menu extends React.Component<Props> {
  render() {
    return (
      <Gui
        id="menu"
        className="game-screen"
        score={0}
        credits={0}
        lives={0}
        background={<Background />}
      >
        <Screen id={0} />
      </Gui>
    )
  }
}
