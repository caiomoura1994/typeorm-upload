import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TableOptions } from "typeorm/schema-builder/options/TableOptions";

export class CreateTransactions1668350913753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const transactionTableOptions: TableOptions = {
            name: 'transactions',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'value',
                    type: 'decimal',
                    precision: 10,
                    scale: 2
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions')
    }

}
