import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_recruitment_requests_notification_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  ALTER TABLE "recruitment_requests" ADD COLUMN "notification_status" "enum_recruitment_requests_notification_status";
  ALTER TABLE "recruitment_requests" ADD COLUMN "notification_at" timestamp(3) with time zone;
  ALTER TABLE "recruitment_requests" ADD COLUMN "notification_detail" varchar;
  ALTER TABLE "recruitment_requests" ADD COLUMN "notification_provider_id" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "recruitment_requests" DROP COLUMN "notification_status";
  ALTER TABLE "recruitment_requests" DROP COLUMN "notification_at";
  ALTER TABLE "recruitment_requests" DROP COLUMN "notification_detail";
  ALTER TABLE "recruitment_requests" DROP COLUMN "notification_provider_id";
  DROP TYPE "public"."enum_recruitment_requests_notification_status";`)
}
