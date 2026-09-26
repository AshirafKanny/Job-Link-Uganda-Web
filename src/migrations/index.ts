import * as migration_20260926_090256_initial from './20260926_090256_initial';

export const migrations = [
  {
    up: migration_20260926_090256_initial.up,
    down: migration_20260926_090256_initial.down,
    name: '20260926_090256_initial'
  },
];
