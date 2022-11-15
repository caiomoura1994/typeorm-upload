import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TableOptions } from "typeorm/schema-builder/options/TableOptions";

export class CreateCategories1668473240311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const transactionTableOptions: TableOptions = {
            name: 'categories',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },

                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'now()',
                    isNullable: true
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'now()',
                    isNullable: true
                },
            ]
        }
        await queryRunner.createTable(new Table(transactionTableOptions))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('categories')
    }

}
