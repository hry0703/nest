import { MigrationInterface, QueryRunner } from "typeorm";

export class Change1741590554888 implements MigrationInterface {
    name = 'Change1741590554888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role\` ADD \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD \`age\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role\` DROP COLUMN \`age\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP COLUMN \`email\``);
    }

}
