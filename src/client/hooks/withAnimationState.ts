import {useState} from 'react';


export const withAnimationState = (options: WithAnimationOptions) => {
  const [animations, setAnimations] = useState(options.animations);
  const [currentFrame, setCurrentFrame] = useState(options.currentFrame || getDefaultFrame(options));
  const [currentAnimation, setCurrentAnimation] = useState(options.currentAnimation);
  const [timers, setTimers] = useState<NodeJS.Timer[]>([])

  function queueFrame(frame: string, when: number) {
    const setFrame = (fr: string) => setCurrentFrame(fr);

    timers.push(setTimeout(() => setFrame(frame), when));
  }

  if (different(options.currentAnimation, currentAnimation)) {
    let buffer: number = 0;

    setCurrentAnimation(options.currentAnimation);

    animations[currentAnimation].forEach(({ frame, duration }) => {
      queueFrame(frame, buffer);
      buffer += duration;
    })
    
    const timer = setTimeout(options.onFinished, buffer);
    setTimers(timers.concat(timer));
  }

  return { currentFrame, setCurrentAnimation };
}

export interface WithAnimationOptions {
  animations:       IAnimations;
  currentAnimation: keyof IAnimations;
  onFinished:       (...args: any[]) => void;
  currentFrame?:    string;
}

interface IFrame {
  frame:      string;
  duration:   number;
}

interface IAnimations {
  normal: IFrame[];
  death:  IFrame[];
}

export function different<T>(a: T, b: T) {
  return a !== b;
}

export const fr = (frame: string, duration: number) => ({ frame, duration });

export function getDefaultFrame(options: WithAnimationOptions): string {
  return options.animations[options.currentAnimation][0].frame;
}
