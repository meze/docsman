export const notEmpty = (name, value, msg) => (typeof value === 'undefined' || value === '' || value === null) ? { [name]: msg } : null;
