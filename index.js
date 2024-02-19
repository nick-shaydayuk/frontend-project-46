import { readFileSync } from 'node:fs';
import path from 'node:path';
import parser from './parser';
import getDiff from './getDiff';
import formatter from './formatter';

const resolvePath = (filePath) => path.resolve(process.cwd(), filePath);

const getExtension = (filename) => {
  switch (path.extname(filename).slice(1)) {
    case 'json':
      return 'json';
    case 'yaml':
      return 'yaml';
    case 'yml':
      return 'yml';
    default:
      return 'json';
  }
};

const getData = (filePath) =>
  parser({
    data: readFileSync(filePath, 'utf-8'),
    format: getExtension(filePath),
  });


const gendiff = ({ filePath1, filePath2, format = 'stylish' }) => {
  const path1 = resolvePath(filePath1);
  const path2 = resolvePath(filePath2);

  const data1 = getData(path1);
  const data2 = getData(path2);  

  return formatter(getDiff(data1, data2), format);
};

export default gendiff;
