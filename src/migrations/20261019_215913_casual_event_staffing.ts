import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_recruitment_requests_enquiry_type" ADD VALUE 'staffing';
  ALTER TABLE "recruitment_requests" ADD COLUMN "staffing_type" varchar;
  ALTER TABLE "recruitment_requests" ADD COLUMN "working_hours" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "recruitment_requests" ALTER COLUMN "enquiry_type" SET DATA TYPE text;
  ALTER TABLE "recruitment_requests" ALTER COLUMN "enquiry_type" SET DEFAULT 'recruitment'::text;
  DROP TYPE "public"."enum_recruitment_requests_enquiry_type";
  CREATE TYPE "public"."enum_recruitment_requests_enquiry_type" AS ENUM('recruitment', 'training');
  ALTER TABLE "recruitment_requests" ALTER COLUMN "enquiry_type" SET DEFAULT 'recruitment'::"public"."enum_recruitment_requests_enquiry_type";
  ALTER TABLE "recruitment_requests" ALTER COLUMN "enquiry_type" SET DATA TYPE "public"."enum_recruitment_requests_enquiry_type" USING "enquiry_type"::"public"."enum_recruitment_requests_enquiry_type";
  ALTER TABLE "recruitment_requests" DROP COLUMN "staffing_type";
  ALTER TABLE "recruitment_requests" DROP COLUMN "working_hours";`)
}
