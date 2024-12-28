export const getFileFormat = (size: string): [number, number] => {
  const formatDict = {
    a1: [594, 841],
  };

  return formatDict[size];
};
