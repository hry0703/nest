import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAge1741589397631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER table role add COLUMN age int ')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER table role drop COLUMN age ')
    }

}
