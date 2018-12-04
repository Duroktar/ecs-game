import {useState} from 'react';

interface IFrame {
  frame:      string;
  duration:   number;
}

interface IAnimations {
  normal: IFrame[];
  death:  IFrame[];
}

export interface WithAnimationOptions {
  animations:       IAnimations;
  currentState:     keyof IAnimations;
  onFinished:       (...args: any[]) => void;
  currentFrame?:    string;
}

export const withAnimationState = (options: WithAnimationOptions) => {
  const [animations, setAnimations] = useState(options.animations);
  const [currentFrame, setCurrentFrame] = useState(options.currentFrame || getDefaultFrame(options));
  const [currentState, setCurrentState] = useState(options.currentState);
  const [timers, setTimers] = useState<NodeJS.Timer[]>([])

  function queueFrame(frame: string, when: number) {
    const setFrame = (fr: string) => setCurrentFrame(fr);

    timers.push(setTimeout(() => setFrame(frame), when));
  }

  if (different(options.currentState, currentState)) {
    let buffer: number = 0;

    setCurrentState(options.currentState);

    animations[currentState]
      .forEach(({ frame, duration }) => {
        queueFrame(frame, buffer);
        buffer += duration;
      }
    )
    
    const timer = setTimeout(() => {
      options.onFinished(currentState)
    }, buffer);

    setTimers(timers.concat(timer));
  }

  return { currentFrame, setCurrentState };
}

export function different<T>(a: T, b: T) {
  return a !== b;
}

export const fr = (frame: string, duration: number) => ({ frame, duration });

export function getDefaultFrame(options: WithAnimationOptions): string {
  return options.animations[options.currentState][0].frame;
}
