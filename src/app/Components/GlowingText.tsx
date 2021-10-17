import * as React from 'react';
import { classNames } from '../Development/Dev';

type GlowingTextProps = {
  children: string;
  hidden: boolean;
  onClick: (...args: any[]) => any;
};

export const GlowingText: React.FC<GlowingTextProps> = React.memo(({ hidden, onClick, children }) => (
  <p className={classNames(hidden && 'hidden', 'fade-in', 'neon', 'retro-red')} onMouseUp={onClick}>
    <span>{children}</span>
  </p>
));
