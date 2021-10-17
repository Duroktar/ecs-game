import * as React from 'react';

interface Props {
  value: number;
}

export function Lives(props: Props) {
  return (
    <div className="flex rows">
      <span>1UP</span>
      <span>{props.value}</span>
    </div>
  )
}
