import { API_ENDPOINT } from '../config/api';
import { handleError } from '../utils/notification';
import 'whatwg-fetch';

function catchError(on) {
  return (err) => {
    handleError('Error on ' + on, err);

    return Promise.reject('API error');
  };
}

function fetchJson(url, options = {}) {
  if (options.method && (options.method.toUpperCase() === 'POST' || options.method.toUpperCase() === 'PUT')) {
    options.headers = Object.assign({}, options.headers || {}, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
  }

  return fetch(`${API_ENDPOINT}/${url}`, options)
    .catch(catchError('Getting a response'))
    .then((response) => response.json())
    .catch(catchError('JSON parsing'));
}

function getProjects() {
  return fetchJson('projects');
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

function updateProject(projectId, project) {
  return fetchJson(
    `projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
}

export default {
  projects: {
    get: getProjects,
    save: saveProject,
    update: updateProject
  },
  documents: {
    get: getDocuments,
    getOne: getDocument,
    save: saveDocument
  }
};
