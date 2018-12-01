import { ISystemManager } from './lib/types';
import * as React from 'react';
import { Omit } from 'react-router';

import { system } from "./game";

export const SystemContext = React.createContext<ISystemManager>(system);

export function withSystemContext<
  P extends { system?: ISystemManager },
  R = Omit<P, 'system'>
>(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <SystemContext.Consumer>
        {value => <Component {...props} system={value} />}
      </SystemContext.Consumer>
    );
  };
}
