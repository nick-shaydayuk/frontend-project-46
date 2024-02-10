import yaml from 'js-yaml';

const parse = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
};

export enum FormatEnum {
  json = 'json',
  yaml = 'yaml',
  yml = 'yml',
}

export default ({data, format}: {data: string, format: FormatEnum}): any => parse[format](data);