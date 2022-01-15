import { FC, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector, walletConnectConnector } from './connector';
import { LocalStorageKey, WalletConnectorName } from '../constants';
import { getItem } from '../utils/localStorage';

const WalletProvider: FC<{}> = ({ children }) => {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const connectorName = getItem(LocalStorageKey.CONNECTOR);
    if (connectorName === WalletConnectorName.WALLET_CONNECT) {
      if (!networkActive && !networkError) {
        activateNetwork(walletConnectConnector())
          .then(() => {})
          .catch((e) => {
            console.log(e);
          });
      }
    } else if (connectorName === WalletConnectorName.METAMASK) {
      injectedConnector
        .isAuthorized()
        .then((isAuthorized) => {
          if (isAuthorized && !networkActive && !networkError) {
            activateNetwork(injectedConnector);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    setLoaded(true);
  }, [activateNetwork, networkActive, networkError]);

  if (loaded) {
    return <>{children}</>;
  }

  return <div>Loading...</div>;
};

export default WalletProvider;
