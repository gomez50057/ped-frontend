export const updateById = (array, id, updateFn) =>
  array.map(item => item.id === id ? updateFn(item) : item);

export const removeById = (array, id) =>
  array.filter(item => item.id !== id);

export const pushToArrayById = (array, id, key, newItem) =>
  updateById(array, id, item => ({
    ...item,
    [key]: [...(item[key] || []), newItem]
  }));

export const pushToNestedMapArray = (obj, outerKey, innerKey, newItem) => {
  return {
    ...obj,
    [outerKey]: {
      ...(obj[outerKey] || {}),
      [innerKey]: [...(obj[outerKey]?.[innerKey] || []), newItem]
    }
  };
};
