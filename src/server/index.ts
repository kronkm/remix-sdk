import { init, LDOptions, LDClient, LDUser } from 'launchdarkly-node-server-sdk';
import ProviderServer from './providerServer';

let client: null | LDClient = null;

const initServerSdk = async (sdkKey: string, options: LDOptions = {}) => {
  client = init(sdkKey, options);
  await client?.waitForInitialization();
  return client;
};

/**
 * This will be used to bootstrap the client side flags when
 * rendering from the server.
 * @param user
 * @returns
 */
const renderFlagsToString = async (user: LDUser) => {
  if (!client) {
    console.error(`LD client is not initialized.`);
    return '';
  }
  const flagData = (await client?.allFlagsState(user))?.toJSON();
  const flagDataString = JSON.stringify(flagData, null, 2);
  return `window.ssrFlags=${flagDataString};`;
};

export { ProviderServer, renderFlagsToString, initServerSdk };
