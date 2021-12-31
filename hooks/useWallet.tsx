import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { injectedConnector, walletConnectConnector } from '../wallet/connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LocalStorageKey, WalletConnectorName } from '../constants';
import { ethers } from 'ethers';
import { setItem } from '../utils/localStorage';

export const useWallet = () => {
  const { activate, deactivate, active, account, connector, library } = useWeb3React();
  const [eth, setEth] = useState('0.0');

  const connectMetamaskWallet = async () => {
    try {
      await activate(injectedConnector);
    } catch (e) {
      console.log(e);
    }
  };

  const connectConnectWallet = async () => {
    // https://github.com/NoahZinsmeister/web3-react/issues/217
    // @ts-ignore
    connector?.walletConnectProvider = undefined;

    try {
      await activate(walletConnectConnector);
    } catch (e) {
      console.log(e);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (active) {
      const connectorName = (connector as WalletConnectConnector).walletConnectProvider
        ? WalletConnectorName.WALLET_CONNECT
        : WalletConnectorName.METAMASK;
      library.getBalance(account).then((balance: number) => {
        setEth(ethers.utils.formatEther(balance));
      });

      setItem(LocalStorageKey.CONNECTOR, connectorName);
    } else {
      setItem(LocalStorageKey.CONNECTOR, 'null');
    }
  }, [active]);

  return {
    eth,
    connectConnectWallet,
    connectMetamaskWallet,
    disconnectWallet,
  };
};
