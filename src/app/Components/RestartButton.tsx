import * as React from 'react';

interface Props {
  onClick: () => void;
}

export function RestartButton(props: Props) {
  return <button className="btn is-success" onClick={props.onClick}>Restart</button>;
}
