import { Mouse } from "../extern/Mouse";
import { Keyboard } from "../extern/Keyboard";

const mouse = new Mouse();
const keyboard = new Keyboard();

export { mouse, keyboard };

// [...]

// //Loop
// mouse.update();
// keyboard.update();

// console.log("Position X:" mouse.position.x + " Y:" + mouse.position.y);
// console.log("Delta X:" mouse.delta.x + " Y:" + mouse.delta.y);
// console.log("Scroll wheel:" mouse.wheel);

// if(mouse.buttonPressed(Mouse.LEFT))
// {
// 	console.log("Mouse left is pressed");
// }

// if(keyboard.keyPressed(Keyboard.W))
// {
// 	console.log("W is pressed");
// }
// if(keyboard.keyJustPressed(Keyboard.W))
// {
// 	console.log("W was just pressed");
// }
// if(keyboard.keyJustReleased(Keyboard.W))
// {
// 	console.log("W was just released");
// }