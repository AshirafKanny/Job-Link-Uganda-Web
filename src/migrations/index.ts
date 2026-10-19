import * as migration_20260926_090256_initial from './20260926_090256_initial';
import * as migration_20260929_214413_email_notifications from './20260929_214413_email_notifications';
import * as migration_20261002_134237_training_enquiries from './20261002_134237_training_enquiries';
import * as migration_20261014_220356_media_storage_object_key from './20261014_220356_media_storage_object_key';
import * as migration_20261019_215913_casual_event_staffing from './20261019_215913_casual_event_staffing';

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
    name: '20261002_134237_training_enquiries',
  },
  {
    up: migration_20261014_220356_media_storage_object_key.up,
    down: migration_20261014_220356_media_storage_object_key.down,
    name: '20261014_220356_media_storage_object_key',
  },
  {
    up: migration_20261019_215913_casual_event_staffing.up,
    down: migration_20261019_215913_casual_event_staffing.down,
    name: '20261019_215913_casual_event_staffing'
  },
];
