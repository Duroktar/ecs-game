import { IMouse, IKeyboard} from '../types';
import { IInputManager } from "../interfaces/IInputManager";
import { Mouse } from "../../extern/Mouse";
import { Keyboard } from "../../extern/Keyboard";

class InputManager implements IInputManager {
  public KeyCodes: Keyboard = Keyboard;
  constructor(
    private mouse: IMouse = new Mouse(),
    private keyboard: IKeyboard = new Keyboard(),
  ) {}

  public buttonPressed = (button: number) => this.mouse.buttonPressed(button);

  public keyPressed = (key: number) => this.keyboard.keyPressed(key);
  public keyJustPressed = (key: number) => this.keyboard.keyJustPressed(key);
  public keyJustReleased = (key: number) => this.keyboard.keyJustReleased(key);

  update = () => {
    this.mouse.update();
    this.keyboard.update();
  };
}

export default InputManager;
