export const getFileFormat = (size: string): [number, number] => {
  const formatDict: { [key: string]: [number, number] } = {
    a1: [596, 842],
  };

  for (const key of Object.keys(formatDict)) {
    if (key === size) return formatDict[size];
  }

  throw new Error(`This size format is not supported`);
};

export const readFileAsDataURL = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
