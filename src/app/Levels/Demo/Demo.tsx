import { withGameLevel } from '../../Hoc/withGameLevel';

export const Demo = withGameLevel({
  enemyPositions: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
  ],
  levelId: 'Demo',
});
