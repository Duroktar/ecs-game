import { MouseEvent } from "react";

export function withBlur(handler: any) {
  return (event: MouseEvent<HTMLButtonElement>): void | undefined => {
    event.currentTarget.blur();
    handler(event);
  }
}
