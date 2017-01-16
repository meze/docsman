export const notEmpty = (name: string, value, msg: string) => (typeof value === 'undefined' || value === '' || value === null) ? { [name]: msg } : null;
