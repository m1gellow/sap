

type extensionType = 'png' | 'svg' | 'jpg';

interface IExoprtAssetsFunc {
  images: Record<string, { default: string }>;
  ext: extensionType;
}

export const exoprtAssetsFunc = ({ images, ext }: IExoprtAssetsFunc): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(images).map(([key, value]) => [key.replace('./', '').replace(`.${ext}`, ''), value.default]),
  );
};
