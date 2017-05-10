// @flow
import { API_ENDPOINT } from '../config/api';
import { error, notice } from '../utils/notification';
import type { CampaignType } from '../modules/Campaign/campaign';
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

function getCampaigns() {
  return fetchJson('campaigns');
}

function getCampaign(campaignId: number) {
  return fetchJson(`campaigns/${campaignId}`);
}

function getDocuments(campaignId: number) {
  return fetchJson(`campaigns/${campaignId}/documents`);
}

function getDocument(campaignId: number, documentId: number) {
  return fetchJson(`campaigns/${campaignId}/documents/${documentId}`);
}

function saveDocument(campaignId: number, document: DocumentType) {
  return fetchJson(
    `campaigns/${campaignId}/documents${document.id ? '/' + document.id : ''}`, {
      method: document.id ? 'PUT' : 'POST',
      body: JSON.stringify(document)
    });
}

function removeDocument(campaignId: number, documentId: number) {
  return fetchJson(
    `campaigns/${campaignId}/documents/${documentId}`, {
      method: 'DELETE'
    });
}

function saveCampaign(campaign: CampaignType) {
  return fetchJson(
    'campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign)
    });
}

function updateCampaign(id: number, campaign: CampaignType) {
  return fetchJson(
    `campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign)
    });
}

function removeCampaign(id: number) {
  return fetchJson(
    `campaigns/${id}`, {
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
  campaigns: {
    get: getCampaigns,
    getOne: getCampaign,
    save: saveCampaign,
    update: updateCampaign,
    remove: removeCampaign
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
