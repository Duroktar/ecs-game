import { withGameLevel } from '../../Hoc/withGameLevel';

export const Level3 = withGameLevel({
  enemyPositions: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  ],
  levelId: '3',
});
