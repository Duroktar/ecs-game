import * as React from 'react';

interface Props {
  value: number;
}

export function Credits(props: Props) {
  return (
    <span>Credits {props.value}</span>
  )
}
