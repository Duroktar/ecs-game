import * as React from 'react';

import { Layout } from "./Base";
import { Lives } from "../Components/Lives";
import { HighScore } from "../Components/HighScore";
import { Credits } from "../Components/Credits";

interface Props {
  id:         string;
  className?: string;
  lives:      number;
  score:      number;
  credits:    number;
  background: React.ReactNode;
  children:   React.ReactNode;
}

export function Gui(props: Props) {
  return (
    <Layout
      id={props.id}
      className={props.className}
      topLeft={<Lives value={props.lives} />}
      topCenter={<HighScore value={props.score} />}
      bottomLeft={<Credits value={props.credits} />}
      background={props.background}
    >
      {props.children}
    </Layout>
  )
}
