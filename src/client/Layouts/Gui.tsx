import * as React from 'react';

import { Layout } from "./Base";
import { Lives } from "../Components/Lives";
import { HighScore } from "../Components/HighScore";
import { Credits } from "../Components/Credits";
import { ISystemManager } from '../../lib/types';

interface Props {
  id:         string;
  className?: string;
  level?:     string | number;
  lives:      number;
  score:      number;
  credits:    number;
  background: React.ReactNode;
  children:   React.ReactNode;
  onRestart?: () => void;
}

export function Gui(props: Props) {
  return (
    <Layout
      id={props.id}
      className={props.className}
      topLeft={<Lives value={props.lives} />}
      topCenter={<HighScore value={props.score} />}
      topRight={props.level ? <p>Level: {props.level}</p> : null}
      bottomLeft={<Credits value={props.credits} />}
      background={props.background}
      bottomRight={<button className="btn is-success" onClick={props.onRestart}>Restart</button>}
    >
      {props.children}
    </Layout>
  )
}
