import 'whatwg-fetch';
import { API_ENDPOINT } from '../config/api';
import { handleError } from '../utils/notification';

function catchError(on: string) {
  return (err) => {
    handleError('Error on ' + on, err);

    throw err;
  };
}

function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  throw new Error('Response status is not ok: ' + response.status);
}

function fetchJson(url: string, options: RequestInit = {}) {
  if (options.method && (options.method.toUpperCase() === 'POST' || options.method.toUpperCase() === 'PUT')) {
    options.headers = {
      ...(options.headers as { [key: string]: string } || {}),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    } as HeadersInit;
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

function getDocument(projectId: number, documentId) {
  return fetchJson(`projects/${projectId}/documents/${documentId}`);
}

function saveDocument(projectId: number, document, documentId: number) {
  return fetchJson(
    `projects/${projectId}/documents${documentId ? '/' + documentId : ''}`, {
      method: documentId ? 'PUT' : 'POST',
      body: JSON.stringify(document)
    });
}

function saveProject(project) {
  return fetchJson(
    'projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
}

function updateProject(id: number, project) {
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
      body: JSON.stringify(id)
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
    save: saveDocument
  }
};
