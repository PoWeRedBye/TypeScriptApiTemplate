export class auth_callback {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly token: string,
  ) {}
}

export default auth_callback;
