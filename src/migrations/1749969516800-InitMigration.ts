import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1749969516800 implements MigrationInterface {
    name = 'InitMigration1749969516800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_num" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier_details" ("id" SERIAL NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "pin" integer NOT NULL, "pan_number" bigint NOT NULL, "gst_num" bigint NOT NULL, "sup_code" character varying(100) NOT NULL, "supplier_id" integer, CONSTRAINT "REL_914fb2ddcb201feea0234f862e" UNIQUE ("supplier_id"), CONSTRAINT "PK_30c5e0127569a28e956ce463359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "email" character varying(150), "mob_num" bigint NOT NULL, "tel_num" bigint NOT NULL, CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_details" ("id" SERIAL NOT NULL, "item_grade" integer NOT NULL, "item_colour" character varying(45) NOT NULL, "car_model" character varying(50), "hsn" double precision, "gst" double precision, "rate" double precision NOT NULL DEFAULT '0', "maintain_stock" integer NOT NULL DEFAULT '0', "stock_control" integer NOT NULL DEFAULT '0', "Qc_stock_control" integer NOT NULL DEFAULT '0', "wp_stock_control" integer NOT NULL DEFAULT '0', "qc_requried" integer NOT NULL DEFAULT '0', "active" integer NOT NULL DEFAULT '0', "items_id" integer, CONSTRAINT "REL_2ceea2307408fe6db26aaf385c" UNIQUE ("items_id"), CONSTRAINT "PK_5454cdc4a554db3678109d12533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_group" ("id" SERIAL NOT NULL, "item_group_name" character varying(45) NOT NULL, CONSTRAINT "PK_6b0100c5cb7c67d99ae46197727" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_sub_group" ("id" SERIAL NOT NULL, "item_subgroup_name" character varying(45) NOT NULL, "item_group_id" integer, CONSTRAINT "PK_ee78c2d0a0093d38a21c58ea430" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" SERIAL NOT NULL, "item_name" character varying(500) NOT NULL, "uom" character varying(50) NOT NULL, "item_group_id" integer NOT NULL, "item_subgroup_id" integer NOT NULL, "pack_size" integer, "item_code" character varying(50) NOT NULL, "erp_code" character varying(50) NOT NULL, "supplier_id" integer, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier_history" ("id" SERIAL NOT NULL, "rate" integer NOT NULL, "created_at" bigint NOT NULL, "created_by" character varying(45) NOT NULL, "valid_date" date NOT NULL, "supplier_id" integer NOT NULL, "items_id" integer NOT NULL, CONSTRAINT "PK_e99a304491bc41175120b95e8e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SuggestionSupplier" ("id" SERIAL NOT NULL, "name" character varying(45) NOT NULL, "email" character varying(45) NOT NULL, "mob_num" bigint NOT NULL, "tel_num" bigint NOT NULL, CONSTRAINT "PK_b6491908d8ab118bfeed4815972" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suggestion_item_master" ("id" SERIAL NOT NULL, "item_name" character varying(45) NOT NULL, "category" character varying(45) NOT NULL, "sub_category" character varying(45) NOT NULL, CONSTRAINT "PK_a511c7393a462b0f661930890cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suggestion_price_master" ("id" SERIAL NOT NULL, "company" character varying(45) NOT NULL, "unit" integer NOT NULL, "effective_date" date NOT NULL, "rate" integer NOT NULL, "default_user" character varying(45) NOT NULL, "supplier_id" integer, "items_id" integer, CONSTRAINT "PK_267a5c41279acf5fc2f33008167" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_requests" ("id" SERIAL NOT NULL, CONSTRAINT "PK_f3c5a8ff7bd4338f4c860925c8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pr_details" ("id" SERIAL NOT NULL, "department" character varying(45) NOT NULL, "date_requested" date NOT NULL, "status" character varying(45) NOT NULL, "item_type" boolean NOT NULL, "item_id" integer, "supplier_id" integer, "purchase_request_id" integer, "suggestion_item_id" integer, "suggestion_supplier_id" integer, CONSTRAINT "PK_18d7c11e14c424a10ebd7adf6af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items_price_master" ("id" SERIAL NOT NULL, "company" character varying(45) NOT NULL, "unit" character varying(50) NOT NULL, "effective_date" date NOT NULL, "rate" numeric(10,2) NOT NULL, "default_user" character varying(45) NOT NULL, "supplier_id" integer, "items_id" integer, CONSTRAINT "PK_bf8417460a7050ab15454a23954" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supplier_details" ADD CONSTRAINT "FK_914fb2ddcb201feea0234f862e7" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD CONSTRAINT "FK_2ceea2307408fe6db26aaf385c0" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_sub_group" ADD CONSTRAINT "FK_5bf759ae4cfe0396edfbb07d05b" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_d3d85915f95e9b3e4af1b0d0123" FOREIGN KEY ("item_group_id") REFERENCES "item_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_d8d77b14c56f35b07b690f15c61" FOREIGN KEY ("item_subgroup_id") REFERENCES "item_sub_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_1b00f62115285f72fd7b51db561" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_history" ADD CONSTRAINT "FK_95a077840c75a1a6c4bf809ffbd" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_history" ADD CONSTRAINT "FK_d783ffedf6123890f99ec20954a" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestion_price_master" ADD CONSTRAINT "FK_91ca4bca2f2f879820ab4bc2654" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestion_price_master" ADD CONSTRAINT "FK_d4e956ab7aff463a50054270a47" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pr_details" ADD CONSTRAINT "FK_e6eca9055b4f530517e3bbd9140" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pr_details" ADD CONSTRAINT "FK_dbac6dea8eb62afd9f1467b99ed" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pr_details" ADD CONSTRAINT "FK_1f1cf191a8aee287ecf54115044" FOREIGN KEY ("purchase_request_id") REFERENCES "purchase_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pr_details" ADD CONSTRAINT "FK_c516069acd7bc1bd8fc4924a379" FOREIGN KEY ("suggestion_item_id") REFERENCES "suggestion_item_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pr_details" ADD CONSTRAINT "FK_9915ff3fc88c042ce20440a8384" FOREIGN KEY ("suggestion_supplier_id") REFERENCES "SuggestionSupplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_price_master" ADD CONSTRAINT "FK_2e9cee6fbfe37ff28838ea1fe63" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_price_master" ADD CONSTRAINT "FK_32e73e906337a61c1ddd98d9ce5" FOREIGN KEY ("items_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items_price_master" DROP CONSTRAINT "FK_32e73e906337a61c1ddd98d9ce5"`);
        await queryRunner.query(`ALTER TABLE "items_price_master" DROP CONSTRAINT "FK_2e9cee6fbfe37ff28838ea1fe63"`);
        await queryRunner.query(`ALTER TABLE "pr_details" DROP CONSTRAINT "FK_9915ff3fc88c042ce20440a8384"`);
        await queryRunner.query(`ALTER TABLE "pr_details" DROP CONSTRAINT "FK_c516069acd7bc1bd8fc4924a379"`);
        await queryRunner.query(`ALTER TABLE "pr_details" DROP CONSTRAINT "FK_1f1cf191a8aee287ecf54115044"`);
        await queryRunner.query(`ALTER TABLE "pr_details" DROP CONSTRAINT "FK_dbac6dea8eb62afd9f1467b99ed"`);
        await queryRunner.query(`ALTER TABLE "pr_details" DROP CONSTRAINT "FK_e6eca9055b4f530517e3bbd9140"`);
        await queryRunner.query(`ALTER TABLE "suggestion_price_master" DROP CONSTRAINT "FK_d4e956ab7aff463a50054270a47"`);
        await queryRunner.query(`ALTER TABLE "suggestion_price_master" DROP CONSTRAINT "FK_91ca4bca2f2f879820ab4bc2654"`);
        await queryRunner.query(`ALTER TABLE "supplier_history" DROP CONSTRAINT "FK_d783ffedf6123890f99ec20954a"`);
        await queryRunner.query(`ALTER TABLE "supplier_history" DROP CONSTRAINT "FK_95a077840c75a1a6c4bf809ffbd"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_1b00f62115285f72fd7b51db561"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_d8d77b14c56f35b07b690f15c61"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_d3d85915f95e9b3e4af1b0d0123"`);
        await queryRunner.query(`ALTER TABLE "item_sub_group" DROP CONSTRAINT "FK_5bf759ae4cfe0396edfbb07d05b"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP CONSTRAINT "FK_2ceea2307408fe6db26aaf385c0"`);
        await queryRunner.query(`ALTER TABLE "supplier_details" DROP CONSTRAINT "FK_914fb2ddcb201feea0234f862e7"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "items_price_master"`);
        await queryRunner.query(`DROP TABLE "pr_details"`);
        await queryRunner.query(`DROP TABLE "purchase_requests"`);
        await queryRunner.query(`DROP TABLE "suggestion_price_master"`);
        await queryRunner.query(`DROP TABLE "suggestion_item_master"`);
        await queryRunner.query(`DROP TABLE "SuggestionSupplier"`);
        await queryRunner.query(`DROP TABLE "supplier_history"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "item_sub_group"`);
        await queryRunner.query(`DROP TABLE "item_group"`);
        await queryRunner.query(`DROP TABLE "item_details"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "supplier_details"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
