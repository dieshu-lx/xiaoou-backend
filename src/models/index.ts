export interface IResponseList<T> {
  data: {
    data: T;
    total: number;
  };
  message: string;
  code: number;
}

export interface IResponse<T> {
  data: T;
  message: string;
  code: number;
}
