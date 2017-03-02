// @flow
import notie from 'notie';

export function error(message: string) {
  notie.alert('error', message, 10);
}

export function success(message: string) {
  notie.alert('success', message, 5);
}

export function notice(message: string) {
  notie.alert('warning', message, 5);
}
