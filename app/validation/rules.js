// @flow
export const notEmpty = (name: string, value: ?string, msg: string) => (typeof value === 'undefined' || value === '' || value === null) ? { [name]: msg } : null;
