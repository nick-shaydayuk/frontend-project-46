import { Command } from 'commander';
import gendiff from '..';
const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filePath1> <filePath2>')
  .action((filePath1, filePath2) => {
    console.log(
      gendiff({
        filePath1: filePath1,
        filePath2: filePath2,
        format: program.opts().format,
      }),
    );
  })
  .parse(process.argv);

const options = program.opts();
