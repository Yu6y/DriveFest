export type RegisterError = {
  username?: string;
  email?: string;
  general?: string;
};

type Idle = {
  state: 'idle';
};

type Loading = {
  state: 'loading';
};

type Success<T> = {
  state: 'success';
  data: T;
};

type Errored = {
  state: 'error';
  error: RegisterError;
};

export type RegisterState<T> = Idle | Loading | Success<T> | Errored;
