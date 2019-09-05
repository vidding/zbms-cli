#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
var VERSION = require('./package').version

program
	.name('zbms')
	.version(VERSION, '-v, --version')
	.command('init <name>')
	.action((name) => {
		console.log(name)
	 
		if(!fs.existsSync(name)){

			inquirer.prompt([
				{
					name: 'description',
					message: '请输入项目描述'
				},
				{
					name: 'author',
					message: '请输入作者名称'
				}
			]).then((answers) => {
				const spinner = ora('正在下载模板...');
				spinner.start();
				// 可以看到端口号后面的 '/' 在参数中要写成 ':'
				download('https://github.com:vidding/zb-microservice-example#template',name,{clone: true},(err) => {
					if(err){
						spinner.fail();
						console.log(symbols.error, chalk.red(err));
					}else{
						spinner.succeed();
						const meta = {
							name,
							description: answers.description,
							author: answers.author
						}
						const fileName = `${name}/package.json`;
						if(fs.existsSync(fileName)){
							const content = fs.readFileSync(fileName).toString();
							const result = handlebars.compile(content)(meta);
							fs.writeFileSync(fileName, result);
						}
						console.log(symbols.success, chalk.green('项目初始化完成'));
						console.log(symbols.success, chalk.green(`进入${name}, 执行 npm install & npm start`));
					}
				})
			})
		} else {
			console.log(symbols.error, chalk.red('项目已存在'));
		}
	});
 
program.parse(process.argv);