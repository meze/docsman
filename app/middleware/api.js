import { API_ENDPOINT } from '../config/api';
import { handleError } from '../utils/notification';
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

function fetchJson(url, options = {}) {
  if (options.method && (options.method.toUpperCase() === 'POST' || options.method.toUpperCase() === 'PUT')) {
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

function getProject(projectId) {
  return fetchJson(`projects/${projectId}`);
}

function getDocuments(projectId) {
  return fetchJson(`projects/${projectId}/documents`);
}

function getDocument(projectId, documentId) {
  return fetchJson(`projects/${projectId}/documents/${documentId}`);
}

function saveDocument(projectId, document, documentId) {
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

function updateProject(id, project) {
  return fetchJson(
    `projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
}

function removeProject(id) {
  return fetchJson(
    `projects/${id}`, {
      method: 'DELETE',
      body: id
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
