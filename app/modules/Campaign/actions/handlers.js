// @flow
import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import type { TypedActionType, AsyncActionType, StateType, ActionType } from '../../../types/redux';
import type { CampaignType, CampaignsPayloadType, CampaignRemovePayloadType, CampaignPayloadType } from '../campaign';
import types from './types';

export const request = (): ActionType => ({
  type: types.REQUEST_CAMPAIGNS,
  payload: null
});

export const invalidate = (): ActionType => ({
  type: types.INVALIDATE_CAMPAIGNS,
  payload: null
});

export const receive = (campaigns: CampaignType[]): TypedActionType<CampaignsPayloadType> => ({
  type: types.RECEIVE_CAMPAIGNS,
  payload: {
    campaigns
  }
});

const doFetch = (): AsyncActionType => (dispatch, getState): Promise<?CampaignType[]> => {
  dispatch(request());

  return api.campaigns.get()
    .then((data) => dispatch(receive(data)))
    .catch((error) => {
      dispatch({
        type: types.RECEIVE_CAMPAIGNS_ERROR,
        payload: null,
        error: error
      });
    });
};

const shouldFetch = ({ campaigns }: StateType): boolean => {
  if (campaigns.isLoading) {
    return false;
  }

  if (!campaigns || campaigns.items.length === 0) {
    return true;
  }

  return campaigns.didInvalidate;
};

export const fetchIfNeeded = (): AsyncActionType => (dispatch, getState): ?Promise<?CampaignType[]> => {
  if (shouldFetch(getState())) {
    return dispatch(doFetch());
  }

  return Promise.resolve();
};

// single

const shouldSwitch = (newCampaignId: number, { campaigns }: StateType): boolean => !(campaigns.currentCampaign && campaigns.currentCampaign.id === newCampaignId);

export const switchReceive = (campaign: CampaignType): TypedActionType<CampaignPayloadType> => ({
  type: types.SWITCH_CAMPAIGN,
  payload: {
    campaign
  }
});

export const switchTo = (campaignId: number): AsyncActionType => (dispatch, getState): Promise<?CampaignType> => {
  if (!shouldSwitch(campaignId, getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: types.SWITCH_CAMPAIGN_REQUEST,
    payload: null
  });

  return api.campaigns.getOne(campaignId)
    .then((data) => dispatch(switchReceive(data)))
    .catch(() => {
      dispatch({
        type: types.SWITCH_CAMPAIGN_ERROR,
        payload: null
      });
    });
};

//
// Updaters
//

export const receiveNew = (campaign: CampaignType): TypedActionType<CampaignPayloadType> => {
  success('A campaign was created.');

  return {
    type: types.NEW_CAMPAIGN,
    payload: {
      campaign
    }
  };
};

export const save = (campaign: CampaignType): AsyncActionType => (dispatch, getState): Promise<?CampaignType> => {
  dispatch({
    type: types.NEW_CAMPAIGN_REQUEST,
    payload: null
  });

  return api.campaigns.save(campaign)
    .then((data) => {
      dispatch(receiveNew(data));

      return data;
    })
    .catch(() => dispatch({
      type: types.NEW_CAMPAIGN_ERROR,
      payload: null
    }));
};

export const receiveUpdated = (campaign: CampaignType): TypedActionType<CampaignPayloadType> => {
  success('A campaign name was changed.');

  return {
    type: types.UPDATE_CAMPAIGN,
    // todo check id?
    payload: {
      campaign
    }
  };
};

export const update = (campaign: CampaignType): AsyncActionType => (dispatch): Promise<?CampaignType> => {
  dispatch({
    type: types.UPDATE_CAMPAIGN_REQUEST,
    payload: null
  });

  return api.campaigns.update(campaign.id, campaign)
    .then((data) => dispatch(receiveUpdated(data)))
    .catch(() => dispatch({
      type: types.UPDATE_CAMPAIGN_ERROR,
      payload: null
    }));
};

const receiveRemovedError = (err: Error): AsyncActionType => (dispatch, getState): void => {
  dispatch({
    type: types.REMOVE_CAMPAIGN_ERROR,
    payload: null
  });

  throw err;
};

export const receiveRemoved = (id: number): TypedActionType<CampaignRemovePayloadType> => {
  success('A campaign was removed.');

  return {
    type: types.REMOVE_CAMPAIGN,
    payload: {
      id
    }
  };
};

export const remove = (id: number): AsyncActionType => (dispatch): Promise<?CampaignType> => {
  dispatch({
    type: types.REMOVE_CAMPAIGN_REQUEST,
    payload: null
  });

  return api.campaigns.remove(id)
    .then((data) => dispatch(receiveRemoved(data)))
    .catch((err) => dispatch(receiveRemovedError(err)));
};
