import * as React from 'react';

export function withCountdownState(start: number, end: number) {
    const [time, setTime] = React.useState(start);
    const [ready, setReady] = React.useState(false);
 
    React.useEffect(() => {
      let i = start;
      let END = end;
    
      for (i; i < END; i++) {

        setTimeout(() => setTime(i), i * 1000);
      }
    
      setTimeout(() => setReady(true), END * 1000);
    }, [])
  
    return { ready, time };
  }
  