import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { injectedConnector, walletConnectConnector } from '../wallet/connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LocalStorageKey, WalletConnectorName } from '../constants';
import { ethers } from 'ethers';
import { setItem } from '../utils/localStorage';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export const useWallet = () => {
  const { activate, deactivate, active, account, connector, library, chainId } = useWeb3React();
  const [eth, setEth] = useState('0.0');

  const connectMetamaskWallet = async () => {
    if (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined') {
      alert('need to install METAMASK!');

      return;
    }

    try {
      await activate(injectedConnector);
    } catch (e) {
      console.log(e, 'hmm?');
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

      setItem(LocalStorageKey.CONNECTOR, connectorName);
    } else {
      setItem(LocalStorageKey.CONNECTOR, 'null');
    }
  }, [active]);

  useEffect(() => {
    if (account && library) {
      library.getBalance(account).then((balance: number) => {
        setEth(ethers.utils.formatEther(balance));
      });
    }
  }, [account, chainId, library]);

  return {
    eth,
    connectConnectWallet,
    connectMetamaskWallet,
    disconnectWallet,
  };
};
