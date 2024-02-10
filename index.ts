import { readFileSync } from 'node:fs';
import path from 'node:path';
import parser, { FormatEnum } from './parser';
import getDifferenceTree from './getDiff';
/* import formatter from './formatters/index.js'; */

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
    data: readFileSync(filePath, 'utf-8'),
    format: getExtension(filePath),
  });

type GendiffArgs = {
  filePath1: string;
  filePath2: string;
  format: string;
};

const gendiff = ({ filePath1, filePath2, format = 'stylish' }: GendiffArgs) => {
  const path1 = resolvePath(filePath1);
  const path2 = resolvePath(filePath2);

  const data1 = getData(path1);
  const data2 = getData(path2);

  return getDiff(data1, data2);
};

export default gendiff;
