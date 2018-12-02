import { withGameLevel } from '../../Hoc/withGameLevel';

export const Level1 = withGameLevel({
  enemyPositions: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  levelId: '1',
});
