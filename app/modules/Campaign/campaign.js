// @flow
export type CampaignType = {
  id: number,
  name: string,
  isLoading: boolean
}

export type CampaignSettingsType = {
  name: string
}

export type CampaignsPayloadType = {
  campaigns: CampaignType[]
}

export type CampaignPayloadType = {
  campaign: CampaignType
}

export type CampaignRemovePayloadType = {
  id: number
}
