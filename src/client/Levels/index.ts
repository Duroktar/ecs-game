import { Level1 } from './1/Level.1';

export interface Levels {
	level1: typeof Level1;
}

export const Levels: Levels = {
	level1: Level1,
}

export { Loader } from './Loader';
