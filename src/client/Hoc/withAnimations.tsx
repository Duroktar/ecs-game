import * as React from 'react';
import { MobModel } from "../../game/Domain/mob";

interface Props {
  model:    MobModel;
  styles:   React.CSSProperties;
  onFinishedAnimation: (name: string) => void;
}

interface State extends WithAnimationProps {
  currentFrame:   number | null;
  finished:       boolean;
}

interface IFrame {
  id:         number;
  duration:   number;
}

interface IAnimations {
  [key: string]: IFrame[];
}
  
interface WithAnimationProps {
  animations:       IAnimations;
  animationFrames:  string[];
  baseSprite:       string;
  currentAnimation: keyof IAnimations;
}

type WithAnimationComponentProps = WithAnimationProps & Props;

export const withAnimation = (
    Component:        React.ComponentType<Props>,
): React.ComponentType<WithAnimationComponentProps> => {
  return class WithAnimation extends React.Component<WithAnimationComponentProps, State> {
    private timers: NodeJS.Timer[] = [];

    constructor(props: WithAnimationComponentProps) {
      super(props);

      this.state = {
        finished:         false,
        currentFrame:     null,
        animations:       props.animations,
        animationFrames:  props.animationFrames,
        baseSprite:       props.baseSprite,
        currentAnimation: props.currentAnimation,
      }
    }
  
    componentWillReceiveProps(nextProps: WithAnimationComponentProps) {
      if (this.props.currentAnimation !== nextProps.currentAnimation) {
        const animationName = nextProps.currentAnimation;
  
        const onFinishedAnimation = () => {
          this.props.onFinishedAnimation('death')
        }
  
        this.beginAnimation(animationName, onFinishedAnimation);
      }
    }
  
    componentWillUnmount() {
      if (this.timers) {
        this.timers.forEach(timer => clearTimeout(timer))
      }
    }
  
    beginAnimation = (animationName: keyof IAnimations, onFinished: () => void) => {
      let animations: IFrame[] = this.state.animations[animationName];
      let buffer:     number   = 0;

      animations!.forEach(({ id, duration }) => {
        this.queueFrame(id, buffer);
        buffer += duration;
      })

      !!animations.length && this.timers.push(setTimeout(onFinished, buffer));
    }
  
    queueFrame = (frame: number, when: number) => {
      const setFrame = (fr: number) => {
        this.setState({ currentFrame: fr });
      }
  
      this.timers.push(setTimeout(() => setFrame(frame), when));
    }
  
    render() {
      const {
        animationFrames,
        animations,
        baseSprite,
        ...rest
    } = this.props;
      const { currentFrame } = this.state;
  
      const getFrame = (frame: number) => {
        return animationFrames[frame]
      }
  
      const imageUri = (currentFrame === null)
        ? baseSprite
        : getFrame(currentFrame);
  
      const styles: React.CSSProperties = {
        position:           'absolute',
        backgroundImage:    `url(${imageUri})`,
        backgroundSize:     'contain',
        backgroundPosition: 'center',
        width:              this.props.model.geometry.width,
        height:             this.props.model.geometry.height,
        left:               this.props.model.position.x,
        top:                this.props.model.position.y,
      }
    
      return <Component {...rest} styles={styles} model={this.props.model} />
    }
  }
}
