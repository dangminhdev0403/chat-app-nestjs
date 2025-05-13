export class ResponseData<T> {
  status: number;
  error: string | null;
  message: string;
  data: T;

  constructor(status: number, error: string | null, message: string, data: T) {
    this.status = status;
    this.error = this.error == null ? null : error;
    this.message = message;
    this.data = data;
  }
}

export interface JWTDecoded {
  nameid: string;
  email: string;
  iat: number;
  exp: number;
}
