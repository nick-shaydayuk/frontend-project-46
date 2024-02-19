import { readFileSync } from 'node:fs';
import path from 'node:path';
import parser from './parser.js';
import getDiff from './getDiff.js';
import formatter from './formatter.js';

const resolvePath = (filePath) => path.resolve(process.cwd(), filePath);

const getExtension = (filename) => path.extname(filename).slice(1);

const getData = (filePath) =>
  parser({
    data: readFileSync(filePath, 'utf-8'),
    format: getExtension(filePath),
  });

const gendiff = (filePath1, filePath2, format = 'stylish') => {
  const path1 = resolvePath(filePath1);
  const path2 = resolvePath(filePath2);

  const data1 = getData(path1);
  const data2 = getData(path2);

  return formatter(getDiff(data1, data2), format);
};

export default gendiff;
