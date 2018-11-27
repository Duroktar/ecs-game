import { Level1 } from './1/Level.1';
import { Demo } from './Demo/Demo';

export const Levels = {
	demo: 		Demo,
	level1: 	Level1,
}

export type Levels = typeof Levels;
export { Loader } from './Loader';
