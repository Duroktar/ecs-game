import {useState} from 'react';


export const withAnimationState = (options: WithAnimationOptions) => {
  const [animations, setAnimations] = useState(options.animations)
  const [currentFrame, setCurrentFrame] = useState(options.currentFrame || 0)
  const [currentAnimation, setCurrentAnimation] = useState(options.currentAnimation)
  const [timers, setTimers] = useState<NodeJS.Timer[]>([])

  const queueFrame = (frame: number, when: number) => {
    const setFrame = (fr: number) => setCurrentFrame(fr);

    timers.push(setTimeout(() => setFrame(frame), when));
  }

  const getFrame = (frameIndex: number) => {
    return options.frames[frameIndex]
  }

  if (different(options.currentAnimation, currentAnimation)) {
    let buffer: number = 0;

    setCurrentAnimation(options.currentAnimation);

    animations[currentAnimation].forEach(({ id, duration }) => {
      queueFrame(id, buffer);
      buffer += duration;
    })
    
    const timer = setTimeout(options.onFinished, buffer);
    setTimers(timers.concat(timer));
  }

  return { currentFrame: getFrame(currentFrame), setCurrentAnimation };
}

export interface WithAnimationOptions {
  animations:       IAnimations;
  currentAnimation: keyof IAnimations;
  onFinished:       (...args: any[]) => void;
  frames:           string[];
  currentFrame?:    number;
}

interface IFrame {
  id:         number;
  duration:   number;
}

interface IAnimations {
  normal: IFrame[];
  death:  IFrame[];
}

export function different<T>(a: T, b: T) {
  return a !== b;
}
