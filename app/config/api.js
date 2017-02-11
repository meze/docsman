// @flow
declare var __TEST__: boolean;

export const API_ENDPOINT = __TEST__ ? 'http://127.0.0.1' : 'http://docsman/app_dev.php';
