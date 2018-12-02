import * as React from 'react';

interface Props {
  value: string | number | undefined;
}

export function LevelStatus(props: Props) {
  return props.value
    ? <p>{`Level: ${props.value}`}</p>
    : null;
}
