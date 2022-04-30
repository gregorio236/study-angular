export interface UserJson {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

export class User {
  constructor(
    public readonly email: string,
    public readonly id: string,
    private readonly _token: string,
    private readonly _tokenExpirationDate: Date
  ) {}

  static parseJson(json: UserJson): User {
    return new User(
      json.email,
      json.id,
      json._token,
      new Date(json._tokenExpirationDate)
    );
  }

  get token(): string | null {
    if (
      this._tokenExpirationDate == null ||
      new Date() > this._tokenExpirationDate
    )
      return null;

    return this._token;
  }

  get msToTokenExpiration(): number {
    return this._tokenExpirationDate.getTime() - new Date().getTime();
  }
}
