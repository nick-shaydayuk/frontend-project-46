import path from 'node:path';
import { JSONResult } from '../__fixtures__/results/JSONResult';
import { stylishResult } from '../__fixtures__/results/stylishResult';
import { plainResult } from '../__fixtures__/results/plainResult';
import gendiff from '../index';

const testList = ['json', 'yml'];

describe('gendiff', () => {
  test.each(testList)('gendiff %s', (format) => {
    const filepath1 = path.resolve(
      process.cwd(),
      `./__fixtures__/file1.${format}`
    );
    const filepath2 = path.resolve(
      process.cwd(),
      `./__fixtures__/file2.${format}`
    );

    expect(gendiff({ filePath1: filepath1, filePath2: filepath2 })).toEqual(
      stylishResult
    );
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: 'json',
      })
    ).toEqual(JSONResult);
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: 'stylish',
      })
    ).toEqual(stylishResult);
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: 'plain',
      })
    ).toEqual(plainResult);
  });
});
