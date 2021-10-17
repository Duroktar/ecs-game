import * as React from 'react';
import { classNames } from '../Development/Dev';

interface Props {
  level:    string;
  onReady:  () => void;
}

export function Countdown(props: Props) {
  const {time, ready} = useCountdownHooks(props);

  return (
    <div className={classNames("center-content", "absolute-fit", ready ? 'fadeout' : 'fadeout-visible')}>
      <p className="neon green">
        <span>{time}</span>
      </p>
    </div>
  );
}

function useCountdownHooks(props: Props) {
  const [time, setTime] = React.useState(5);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let END = 5;
    
    setTime(END);
    setReady(false);
  
    for (let i = 0; i <= END; i++) {
      setTimeout(() => setTime(END - i), i * 1000);
    }
  
    setTimeout(() => {
      setReady(true);
      props.onReady();
    }, END * 1000);

  }, [props.level])

  return { time, ready }
}
