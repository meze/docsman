// @flow
import type { CampaignType } from '../campaign';

export type SelectedCampaignType = {
  id: number,
  name: string,
  isLoading: boolean
}

export type CampaignStateType = {
  isLoading: boolean,
  didInvalidate: boolean,
  items: CampaignType[],
  currentCampaign: SelectedCampaignType
}

const initialState: CampaignStateType = {
  isLoading: false,
  didInvalidate: true,
  items: [],
  currentCampaign: { id: 0, name: '', isLoading: true }
};

export default initialState;
