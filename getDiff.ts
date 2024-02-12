import _ from 'lodash';

export enum ChangedDataType {
  added = 'added',
  removed ='removed',
  changed = 'changed',
  nested = 'nested',
  unchanged = 'unchanged'
}

export type ChangedData = {
  type: ChangedDataType,
  key: string,
  value?: boolean | string | number,
  children?: ChangedData[],
  oldValue?: any,
  newValue?: any,
}

const loadDiff = (data1: any, data2: any): ChangedData[] => {
  const data1Keys = _.keys(data1);
  const data2Keys = _.keys(data2);
  const sortedKeys = _.sortBy(_.union(data1Keys, data2Keys));  

  const children = sortedKeys.map((key: string): ChangedData => {    
    if (!_.has(data1, key)) {
      return {
        type: ChangedDataType.added,
        key,
        value: data2[key],
      };
    }
    if (!_.has(data2, key)) {
      return {
        type: ChangedDataType.removed,
        key,
        value: data1[key],
      };
    }
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {      
      return {
        type: ChangedDataType.nested,
        key,
        children: loadDiff(data1[key], data2[key]),
      };
    }
    if (_.isEqual(data1[key], data2[key])) {
      return {
        type: ChangedDataType.unchanged,
        key,
        value: data1[key],
      };
    }
    return {
      type: ChangedDataType.changed,
      key,
      oldValue: data1[key],
      newValue: data2[key],
    };
  });
  return children;
};

export type DiffDataType = {
  type: 'root',
  children: ChangedData[]
}

export default (data1: string, data2: string): DiffDataType => ({
  type: 'root',
  children: loadDiff(data1, data2),
});