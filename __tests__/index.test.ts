

import path from 'node:path';
import { JSONResult } from '../__fixtures__/results/JSONResult';
import { stylishResult } from '../__fixtures__/results/stylishResult';
import { plainResult } from '../__fixtures__/results/plainResult';
import gendiff from '../index';
import { FormatCaseEnum } from '../formatter';

const testList = ['json', 'yml'];

describe('gendiff', () => {
  test.each(testList)('gendiff %s', (format) => {
    const filepath1 = path.resolve(process.cwd(), `./__fixtures__/file1.${format}`);
    const filepath2 = path.resolve(process.cwd(), `./__fixtures__/file2.${format}`);

    expect(gendiff({ filePath1: filepath1, filePath2: filepath2 })).toEqual(
      stylishResult,
    );
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: FormatCaseEnum.json,
      }),
    ).toEqual(JSONResult);
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: FormatCaseEnum.stylish,
      }),
    ).toEqual(stylishResult);
    expect(
      gendiff({
        filePath1: filepath1,
        filePath2: filepath2,
        format: FormatCaseEnum.plain,
      }),
    ).toEqual(plainResult);
  });
});
