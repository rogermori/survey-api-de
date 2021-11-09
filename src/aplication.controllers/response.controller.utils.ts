import config from "../config/configuration";

export const createLocationHeader = (responseBatchId: string) =>
  `/${config.api.version["2021-11-01"]}/responses?responseBatchId=${responseBatchId}`;

export const createResponse = (responseBatchId: string) => ({
  location: createLocationHeader(responseBatchId),
});
