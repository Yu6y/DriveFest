export type ErrorType = { message: string };

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
  error: string;
};

export type LoadingState<T> = Idle | Loading | Success<T> | Errored;
