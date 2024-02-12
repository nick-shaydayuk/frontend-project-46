import { PathLike, readFileSync } from 'node:fs';
import path from 'node:path';
import parser, { FormatEnum } from './parser';
import getDiff from './getDiff';
import formatter, { FormatCaseEnum } from './formatter';

const resolvePath = (filePath: string) => path.resolve(process.cwd(), filePath);

const getExtension = (filename: string): FormatEnum => {
  switch (path.extname(filename).slice(1)) {
    case 'json':
      return FormatEnum.json;
    case 'yaml':
      return FormatEnum.yaml;
    case 'yml':
      return FormatEnum.yml;
    default:
      return FormatEnum.json;
  }
};

const getData = (filePath: string) =>
  parser({
    data: readFileSync(filePath as PathLike, 'utf-8') as string,
    format: getExtension(filePath),
  });

type GendiffArgs = {
  filePath1: string;
  filePath2: string;
  format?: FormatCaseEnum;
};

const gendiff = ({ filePath1, filePath2, format = FormatCaseEnum.stylish }: GendiffArgs) => {
  const path1 = resolvePath(filePath1);
  const path2 = resolvePath(filePath2);

  const data1 = getData(path1);
  const data2 = getData(path2);  

  return formatter(getDiff(data1, data2), format);
};

/* console.log(gendiff({ filePath1: './__fixtures__/file1.json', filePath2:'./__fixtures__/file2.json' }))
 */
export default gendiff;
