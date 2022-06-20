const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const client = require('scp2');

const NODE_ENV = process.env.NODE_ENV;

const dist = path.resolve(__dirname, 'dist');

const testServerConfig = {
  port: 22,
  host: '192.168.208.14',
  username: 'appuser',
  password: 'f@9FVxz!5yYNXi',
  path: '/app/bi/'
};

const config = {
  test: testServerConfig,
};

console.log(chalk.yellow('\n  Start to deploying....\n'));

const spinner = ora(`正在部署到 ${chalk.red(NODE_ENV)} . . .`);

spinner.start();

client.scp(dist, config[NODE_ENV], (error) => {
  spinner.stop();
  if (error) {
    console.log(error);
  } else {
    console.log(chalk.green(`\n  deploy finished`));
  }
});
