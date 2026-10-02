import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_recruitment_requests_enquiry_type" AS ENUM('recruitment', 'training');
  ALTER TABLE "recruitment_requests" ADD COLUMN "enquiry_type" "enum_recruitment_requests_enquiry_type" DEFAULT 'recruitment' NOT NULL;
  ALTER TABLE "recruitment_requests" ADD COLUMN "training_package" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "recruitment_requests" DROP COLUMN "enquiry_type";
  ALTER TABLE "recruitment_requests" DROP COLUMN "training_package";
  DROP TYPE "public"."enum_recruitment_requests_enquiry_type";`)
}
