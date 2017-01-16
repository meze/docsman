import notie from 'notie';

declare var __DEV__: boolean;

export function error(message: string) {
  notie.alert('error', message, 10);
}

export function success(message: string) {
  notie.alert('success', message, 5);
}

export function notice(message: string) {
  notie.alert('warning', message, 5);
}

export function handleError(message: string, err) {
  error('A network error occurred.');
  if (__DEV__) {
    console.warn(message, err);
  }
}
