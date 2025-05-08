import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746706691704 implements MigrationInterface {
    name = 'InitialMigration1746706691704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "password" character varying NOT NULL, "organization_id" integer NOT NULL, "email" character varying NOT NULL, "mobile_no" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "role_id" integer NOT NULL, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_service_master" ("id" SERIAL NOT NULL, "service_id" integer NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_05b8c16a78a82966c21288aaf8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_master" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedat" TIMESTAMP, "deletedby" character varying, CONSTRAINT "PK_4699fed099e7f54e7fa16b89762" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_master" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_2c60b8a7d956d3a6ab21af7b712" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_details" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "address" text NOT NULL, "TFN_number" character varying NOT NULL, "license" character varying NOT NULL, "proof_of_age" character varying NOT NULL, "passport" character varying NOT NULL, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "REL_d00c241c213dba296d725793d2" UNIQUE ("vendor_id"), CONSTRAINT "PK_191324acb46928eed4a8412c293" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_services" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "service_id" integer NOT NULL, "sub_service_id" integer NOT NULL, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_f284e74dbe63423ca854c9c006b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_details" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "address" text NOT NULL, "TFN_number" character varying NOT NULL, "license" character varying NOT NULL, "proof_of_age" character varying NOT NULL, "passport" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "REL_30c295036da7b372bb834becca" UNIQUE ("customer_id"), CONSTRAINT "PK_ca144d4b855fe08c813815bb2a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_documents" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "TFN" text NOT NULL, "license" text NOT NULL, "proof_of_age" text NOT NULL, "passport" text NOT NULL, "file_path" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "REL_5301fb44d91d7a9102f12fba58" UNIQUE ("customer_id"), CONSTRAINT "PK_ccc82daa515b50e68a76f343417" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_devices" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "device_type" character varying NOT NULL, "device_id" character varying NOT NULL, "device_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_3aaf111c9a1a0b07c9666bda1a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_requests" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "vendor_id" integer NOT NULL, "service_id" integer NOT NULL, "sub_service_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_45ef185f553e792da9b83fa2464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "mobile" character varying NOT NULL, "age" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assignments" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "vendor_id" integer NOT NULL, "care_category" character varying NOT NULL, "care_type" character varying NOT NULL, "request_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "mobile" character varying NOT NULL, "age" integer NOT NULL, "status" character varying NOT NULL, "organization_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_documents" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "TFN" text NOT NULL, "license" text NOT NULL, "proof_of_age" text NOT NULL, "passport" text NOT NULL, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_b6aa864f4d6f4a283445266a4dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_request_histories" ("id" SERIAL NOT NULL, "request_id" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_0c2622f522712da83c132ccd887" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "vendor_id" integer NOT NULL, "message" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "deletedAt" TIMESTAMP, "deletedBy" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sub_service_master" ADD CONSTRAINT "FK_c510f5c2e196e950610972a2fb0" FOREIGN KEY ("service_id") REFERENCES "service_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_details" ADD CONSTRAINT "FK_d00c241c213dba296d725793d25" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_services" ADD CONSTRAINT "FK_f939652374270ae1eedea0ccd90" FOREIGN KEY ("service_id") REFERENCES "service_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_services" ADD CONSTRAINT "FK_a786fedee81b33e6467a9962e61" FOREIGN KEY ("sub_service_id") REFERENCES "sub_service_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_services" ADD CONSTRAINT "FK_f747f5b7342cafe68c55fc15cae" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_details" ADD CONSTRAINT "FK_30c295036da7b372bb834beccab" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ADD CONSTRAINT "FK_5301fb44d91d7a9102f12fba583" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_devices" ADD CONSTRAINT "FK_71b7b5f24ed2f43dc53a4b24283" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_requests" ADD CONSTRAINT "FK_75ee255dbb4094098b7847355bb" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_requests" ADD CONSTRAINT "FK_d735367b28fe288e4c9433e7dbb" FOREIGN KEY ("service_id") REFERENCES "service_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_requests" ADD CONSTRAINT "FK_8cb37db7a5507a7e4e33978157e" FOREIGN KEY ("sub_service_id") REFERENCES "sub_service_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_37c6556fd097f283a5bfc7c776d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_0cdb98fbe9bd5a08a399fa816bc" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_0cdb98fbe9bd5a08a399fa816bc"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_37c6556fd097f283a5bfc7c776d"`);
        await queryRunner.query(`ALTER TABLE "customer_requests" DROP CONSTRAINT "FK_8cb37db7a5507a7e4e33978157e"`);
        await queryRunner.query(`ALTER TABLE "customer_requests" DROP CONSTRAINT "FK_d735367b28fe288e4c9433e7dbb"`);
        await queryRunner.query(`ALTER TABLE "customer_requests" DROP CONSTRAINT "FK_75ee255dbb4094098b7847355bb"`);
        await queryRunner.query(`ALTER TABLE "customer_devices" DROP CONSTRAINT "FK_71b7b5f24ed2f43dc53a4b24283"`);
        await queryRunner.query(`ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_5301fb44d91d7a9102f12fba583"`);
        await queryRunner.query(`ALTER TABLE "customer_details" DROP CONSTRAINT "FK_30c295036da7b372bb834beccab"`);
        await queryRunner.query(`ALTER TABLE "vendor_services" DROP CONSTRAINT "FK_f747f5b7342cafe68c55fc15cae"`);
        await queryRunner.query(`ALTER TABLE "vendor_services" DROP CONSTRAINT "FK_a786fedee81b33e6467a9962e61"`);
        await queryRunner.query(`ALTER TABLE "vendor_services" DROP CONSTRAINT "FK_f939652374270ae1eedea0ccd90"`);
        await queryRunner.query(`ALTER TABLE "vendor_details" DROP CONSTRAINT "FK_d00c241c213dba296d725793d25"`);
        await queryRunner.query(`ALTER TABLE "sub_service_master" DROP CONSTRAINT "FK_c510f5c2e196e950610972a2fb0"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "customer_request_histories"`);
        await queryRunner.query(`DROP TABLE "vendor_documents"`);
        await queryRunner.query(`DROP TABLE "vendor"`);
        await queryRunner.query(`DROP TABLE "assignments"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "customer_requests"`);
        await queryRunner.query(`DROP TABLE "customer_devices"`);
        await queryRunner.query(`DROP TABLE "customer_documents"`);
        await queryRunner.query(`DROP TABLE "customer_details"`);
        await queryRunner.query(`DROP TABLE "vendor_services"`);
        await queryRunner.query(`DROP TABLE "vendor_details"`);
        await queryRunner.query(`DROP TABLE "role_master"`);
        await queryRunner.query(`DROP TABLE "service_master"`);
        await queryRunner.query(`DROP TABLE "sub_service_master"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
