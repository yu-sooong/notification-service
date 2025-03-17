import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1742196823364
  implements MigrationInterface
{
  name = 'CreateNotificationsTable1742196823364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`channel\` varchar(50) NOT NULL, \`message\` text NOT NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_9a8a82462cab47c73d25f49261\` (\`user_id\`), INDEX \`IDX_0fc9fe9a0d500d8275ee4bbc4c\` (\`channel\`), INDEX \`IDX_92f5d3a7779be163cbea7916c6\` (\`status\`), INDEX \`IDX_77ee7b06d6f802000c0846f3a5\` (\`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_77ee7b06d6f802000c0846f3a5\` ON \`notifications\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_92f5d3a7779be163cbea7916c6\` ON \`notifications\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0fc9fe9a0d500d8275ee4bbc4c\` ON \`notifications\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9a8a82462cab47c73d25f49261\` ON \`notifications\``,
    );
    await queryRunner.query(`DROP TABLE \`notifications\``);
  }
}
