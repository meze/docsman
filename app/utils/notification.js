import notie from 'notie';

export function error(message) {
  notie.alert('error', message, 10);
}

export function success(message) {
  notie.alert('success', message, 5);
}

export function notice(message) {
  notie.alert('warning', message, 5);
}

export function handleError(message, err) {
  error('A network error occurred.');
  console.warn(message, err); // eslint-disable-line no-console
}
