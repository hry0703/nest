import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741589146170 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER table role add COLUMN email varchar(50) ')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER table role drop COLUMN email ')
    }

}
