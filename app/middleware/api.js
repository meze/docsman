// @flow
import { API_ENDPOINT } from '../config/api';
import { handleError } from '../utils/notification';
import type { ProjectType } from '../modules/Project/project';
import type { DocumentType } from '../modules/Document/document';
import 'whatwg-fetch';

function catchError(on) {
  return (err) => {
    handleError('Error on ' + on, err);

    throw err;
  };
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  throw new Error('Response status is not ok: ' + response.status);
}

function fetchJson(url: string, options: RequestOptions = {}) {
  const method = options.method;
  if (method && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
    options.headers = Object.assign({}, options.headers || {}, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
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
