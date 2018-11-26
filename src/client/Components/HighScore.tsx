import * as React from 'react';

interface Props {
  value: number;
}

export function HighScore(props: Props) {
  return (
    <div className="flex rows">
      <span>High Score</span>
      <span>{props.value}</span>
    </div>
  )
}
