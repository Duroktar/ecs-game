import {useState} from 'react';


export const withAnimationState = (props: Props) => {
  const [animations, setAnimations] = useState(props.animations)
  const [currentFrame, setCurrentFrame] = useState(props.currentFrame)
  const [currentAnimation, setCurrentAnimation] = useState(props.currentAnimation)
  const [timers, setTimers] = useState<NodeJS.Timer[]>([])

  const queueFrame = (frame: number, when: number) => {
    const setFrame = (fr: number) => setCurrentFrame(fr);

    timers.push(setTimeout(() => setFrame(frame), when));
  }

  if (different(props.currentAnimation, currentAnimation)) {
    let buffer: number = 0;

    setCurrentAnimation(props.currentAnimation);

    animations[props.currentAnimation].forEach(({ id, duration }) => {
      queueFrame(id, buffer);
      buffer += duration;
    })

    const timer = setTimeout(props.onFinished, buffer);
    setTimers(timers.concat(timer));
  }

  return { currentFrame };
}

interface Props {
  animations:       IAnimations;
  currentFrame:     number | null;
  currentAnimation: keyof IAnimations;
  dead:             boolean;
  onFinished:       (...args: any[]) => void;
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
