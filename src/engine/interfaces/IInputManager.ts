import { Keyboard } from "../../extern/Keyboard";

export interface IInputManager {
  KeyCodes: typeof Keyboard;
  buttonPressed: (button: number) => boolean;
  keyPressed: (key: number) => boolean;
  keyJustPressed: (key: number) => boolean;
  keyJustReleased: (key: number) => boolean;
  update: () => void;
}
