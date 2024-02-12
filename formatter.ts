import _ from 'lodash';
import { DiffDataType } from './getDiff';

export enum FormatCaseEnum {
  stylish = 'stylish',
  plain = 'plain',
  json = 'json',
}

const getPath = (nodeNames: string[]) => nodeNames.flat().join('.');

const getFormattedValue = (value: string) => {
  switch (typeof value) {
    case 'object': {
      return !value ? 'null' : '[complex value]';
    }
    case 'string': {
      return `'${value}'`;
    }
    default: {
      return `${value}`;
    }
  }
};

export function makePlainDiff(tree: any) {
  const iter = (node: any, path: any) =>
    node.map(
      (child: {
        key: string;
        type: any;
        children: any;
        value: string;
        oldValue: string;
        newValue: string;
      }) => {
        const currentPath = getPath([path, child.key]);
        switch (child.type) {
          case 'nested': {
            return iter(child.children, currentPath);
          }
          case 'added': {
            return `Property '${currentPath}' was added with value: ${getFormattedValue(child.value)}`;
          }
          case 'removed': {
            return `Property '${currentPath}' was removed`;
          }
          case 'changed': {
            return `Property '${currentPath}' was updated. From ${getFormattedValue(child.oldValue)} to ${getFormattedValue(child.newValue)}`;
          }
          case 'unchanged': {
            return null;
          }
          default: {
            throw Error('Uncorrect data');
          }
        }
      },
    );
  return iter(tree.children, []);
}

export function makePlain(data: DiffDataType) {
  const result = makePlainDiff(data);
  return _.flattenDeep(result)
    .filter((el) => el)
    .join('\n');
}

const indent = ' ';
const indentSize = 4;
const currentIndent = (depth: number) => indent.repeat(indentSize * depth - 2);
const braceIndent = (depth: number) =>
  indent.repeat(indentSize * depth - indentSize);

const joinStrings = (lines: any, depth: number) =>
  ['{', ...lines, `${braceIndent(depth)}}`].join('\n');

const stringify = (data: any, depth: number): string => {
  if (!_.isObject(data) || data === null) {
    return String(data);
  }
  const keys = _.keys(data);
  const lines = keys.map(
    (key) =>
      `${currentIndent(depth)}  ${key}: ${stringify((data as any)[key], depth + 1)}`,
  );
  return joinStrings(lines, depth);
};

const makeStylishDiff = (tree: any) => {  
  const iter = (node: any, depth: number) => {
    switch (node.type) {
      case 'root': {
        const result = node.children.flatMap((child: any) => iter(child, depth));
        return joinStrings(result, depth);
      }
      case 'nested': {
        const childrenToString = node.children.flatMap((child: any) =>
          iter(child, depth + 1),
        );
        return `${currentIndent(depth)}  ${node.key}: ${joinStrings(childrenToString, depth + 1)}`;
      }
      case 'added': {
        return `${currentIndent(depth)}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      case 'removed': {
        return `${currentIndent(depth)}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      case 'changed': {
        return [
          `${currentIndent(depth)}- ${node.key}: ${stringify(node.oldValue, depth + 1)}`,
          `${currentIndent(depth)}+ ${node.key}: ${stringify(node.newValue, depth + 1)}`,
        ];
      }
      case 'unchanged': {
        return `${currentIndent(depth)}  ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      default: {
        throw Error('Uncorrect data');
      }
    }
  };
  return iter(tree, 1);
};

export default (tree: DiffDataType, format: FormatCaseEnum) => {
  switch (format) {
    case FormatCaseEnum.stylish:
      return makeStylishDiff(tree);
    case FormatCaseEnum.plain:
      return makePlain(tree);
    case FormatCaseEnum.json:
      return JSON.stringify(tree);
    default:
      throw new Error('invalid data');
  }
};
