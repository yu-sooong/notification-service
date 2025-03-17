module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['**/test/**/*.spec.ts'], // 包含 test 資料夾
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/main.ts', // 排除 app 啟動
    '!src/app.module.ts', // 排除 module
    '!src/modules/*.ts', // 排除 module
    '!src/cli/**/*.ts', // 排除 CLI
    '!src/config/*.ts', // 排除設定檔
    '!src/seeds/**/*.ts', // 排除 seeder
    '!src/migrations/**/*.ts', // 排除 migration
    '!src/**/*.d.ts', // 排除型別檔
    '!src/workers/*.d.ts', // 排除型別檔
    /* 其他 */
    '!src/workers/notification-main.worker.ts',
    '!src/workers/notification-module.worker.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  globals: {
    branches: 85, // 條件判斷至少 85% 被測試到
    functions: 90, // 函數至少 90% 被測
    lines: 90, // 總行數至少 90%
    statements: 90, // 敘述至少 90%
  },
};
