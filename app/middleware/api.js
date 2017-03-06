// @flow
import { API_ENDPOINT } from '../config/api';
import { error, notice } from '../utils/notification';
import type { ProjectType } from '../modules/Project/project';
import type { DocumentType } from '../modules/Document/document';
import 'whatwg-fetch';

declare var __DEV__: boolean;

function showError(message: string, err: any) {
  error('A network error occurred.');
  if (__DEV__) {
    console.warn(message, err); // eslint-disable-line no-console
  }
}

function showAuthorizationError() {
  notice('Authentication is required.');
}

function catchError(on) {
  return (err) => {
    if (err.status === 401) {
      showAuthorizationError();
    } else {
      showError('Error on ' + on, err);
    }

    throw err;
  };
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  // We can use error code in authorization middleware
  const err = new Error('Response status is not ok: ' + response.status);
  (err: Object).status = response.status;

  throw err;
}

function fetchJson(url: string, options: RequestOptions = {}) {
  const method = options.method;
  if (method && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
  }

  const token = localStorage.getItem('token');
  if (token) {
    const headers: { [key: string]: string } = options.headers || {};
    options.headers = Object.assign(headers, { Authorization: 'Bearer ' + token });
  }

  return fetch(`${API_ENDPOINT}/${url}`, options)
    .catch(catchError('getting a response'))
    .then(handleResponse)
    .catch(catchError('decoding response'));
}

function getProjects() {
  return fetchJson('projects');
}

function getProject(projectId: number) {
  return fetchJson(`projects/${projectId}`);
}

function getDocuments(projectId: number) {
  return fetchJson(`projects/${projectId}/documents`);
}

function getDocument(projectId: number, documentId: number) {
  return fetchJson(`projects/${projectId}/documents/${documentId}`);
}

function saveDocument(projectId: number, document: DocumentType) {
  return fetchJson(
    `projects/${projectId}/documents${document.id ? '/' + document.id : ''}`, {
      method: document.id ? 'PUT' : 'POST',
      body: JSON.stringify(document)
    });
}

function removeDocument(projectId: number, documentId: number) {
  return fetchJson(
    `projects/${projectId}/documents/${documentId}`, {
      method: 'DELETE'
    });
}

function saveProject(project: ProjectType) {
  return fetchJson(
    'projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
}

function updateProject(id: number, project: ProjectType) {
  return fetchJson(
    `projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
}

function removeProject(id: number) {
  return fetchJson(
    `projects/${id}`, {
      method: 'DELETE',
      body: id.toString()
    });
}

function login(email: string, password: string) {
  return fetchJson(
    `api/login_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `_username=${encodeURIComponent(email)}&_password=${encodeURIComponent(password)}`
    });
}

export default {
  projects: {
    get: getProjects,
    getOne: getProject,
    save: saveProject,
    update: updateProject,
    remove: removeProject
  },
  documents: {
    get: getDocuments,
    getOne: getDocument,
    save: saveDocument,
    remove: removeDocument
  },
  security: {
    login: login
  }
};
