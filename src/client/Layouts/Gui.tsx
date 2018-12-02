import * as React from 'react';

import { Layout } from "./Base";
import { Lives } from "../Components/Lives";
import { HighScore } from "../Components/HighScore";
import { Credits } from "../Components/Credits";
import { LevelStatus } from '../Components/LevelStatus';
import { RestartButton } from '../Components/RestartButton';

interface Props {
  id:         string;
  className?: string;
  level?:     string | number;
  lives:      number;
  score:      number;
  credits:    number;
  background: React.ReactNode;
  children:   React.ReactNode;
  onRestart: () => void;
}

export function Gui(props: Props) {
  return (
    <Layout
      id={props.id}
      className={props.className}
      topLeft={<Lives value={props.lives} />}
      topCenter={<HighScore value={props.score} />}
      topRight={<LevelStatus value={props.level} />}
      bottomLeft={<Credits value={props.credits} />}
      background={props.background}
      bottomRight={<RestartButton onClick={props.onRestart} />}
    >
      {props.children}
    </Layout>
  )
}
