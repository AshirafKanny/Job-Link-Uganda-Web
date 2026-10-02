import * as migration_20260926_090256_initial from './20260926_090256_initial';
import * as migration_20260929_214413_email_notifications from './20260929_214413_email_notifications';
import * as migration_20261002_134237_training_enquiries from './20261002_134237_training_enquiries';

export const migrations = [
  {
    up: migration_20260926_090256_initial.up,
    down: migration_20260926_090256_initial.down,
    name: '20260926_090256_initial',
  },
  {
    up: migration_20260929_214413_email_notifications.up,
    down: migration_20260929_214413_email_notifications.down,
    name: '20260929_214413_email_notifications',
  },
  {
    up: migration_20261002_134237_training_enquiries.up,
    down: migration_20261002_134237_training_enquiries.down,
    name: '20261002_134237_training_enquiries'
  },
];
