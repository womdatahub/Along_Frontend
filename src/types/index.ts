export type ImageType = {
  imageFile: string | ArrayBuffer | File | null;
  imageName: string;
  imageSize: number;
  url?: string;
};

export type ApiResponse<T = Record<string, unknown>> = {
  status: string;
  message: string;
  data: T;
};

export type SelectorFn<TStore, TResult> = (state: TStore) => TResult;
