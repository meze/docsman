// @flow
import type { TypedActionType } from '../../../types/redux';
import type { CampaignsPayloadType, CampaignPayloadType, CampaignRemovePayloadType } from '../campaign';
import types from './types';
import initialState from './state';

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------
type StateType = typeof initialState
export default (state: StateType = initialState, action: TypedActionType<*>): StateType => {
  switch (action.type) {
    case types.INVALIDATE_CAMPAIGNS:
      return {
        ...state,
        didInvalidate: true
      };
    case types.REQUEST_CAMPAIGNS:
      return {
        ...state,
        isLoading: true,
        didInvalidate: false
      };
    case types.RECEIVE_CAMPAIGNS: {
      const payload: CampaignsPayloadType = action.payload;

      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        items: payload.campaigns
      };
    }
    case types.RECEIVE_CAMPAIGNS_ERROR:
      return {
        ...state,
        isLoading: false
      };
    case types.UPDATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.UPDATE_CAMPAIGN_ERROR:
      return {
        ...state,
        isLoading: false
      };
    case types.UPDATE_CAMPAIGN: {
      const payload: CampaignPayloadType = action.payload;
      const campaign = payload.campaign;
      if (!campaign) {
        return state;
      }

      const items = Array.from(state.items);
      const key = items.findIndex((x) => x && x.id === campaign.id);
      if (key >= 0) {
        items[key] = campaign;
      }

      return {
        ...state,
        items,
        isLoading: false,
        currentCampaign: state.currentCampaign && state.currentCampaign.id === campaign.id ? campaign : state.currentCampaign
      };
    }
    case types.NEW_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.NEW_CAMPAIGN: {
      const payload: CampaignPayloadType = action.payload;
      const campaign = payload.campaign;

      return {
        ...state,
        isLoading: false,
        items: [
          campaign,
          ...state.items
        ]
      };
    }
    case types.REMOVE_CAMPAIGN: {
      const payload: CampaignRemovePayloadType = action.payload;
      const id = payload.id;
      const itemsWithoutRemoved = state.items.filter((x) => x.id !== id);

      return {
        ...state,
        items: itemsWithoutRemoved
      };
    }
    case types.SWITCH_CAMPAIGN_REQUEST:
      return {
        ...state,
        currentCampaign: initialState.currentCampaign
      };
    case types.SWITCH_CAMPAIGN: {
      const payload: CampaignPayloadType = action.payload;
      const campaign = payload.campaign;

      return {
        ...state,
        currentCampaign: campaign
      };
    }
    case types.SWITCH_CAMPAIGN_ERROR:
      return state;
    default:
      return state;
  }
};
