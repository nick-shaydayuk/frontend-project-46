export enum FormatEnum {
  stylish = 'stylish',
  plain = 'plain',
  json = 'json'
}

export default (tree: any, format: FormatEnum) => {
  switch (format) {
    case FormatEnum.stylish:
      return /* toStylish(tree); */
    case FormatEnum.plain:
      return /* toPlain(tree); */
    case FormatEnum.json:
      return JSON.stringify(tree);
    default:
      throw new Error('Uncorrect data');
  }
}