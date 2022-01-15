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
      setItem(LocalStorageKey.CONNECTOR, WalletConnectorName.METAMASK);
    } catch (e) {
      console.log(e, 'hmm?');
    }
  };

  const connectWalletConnect = async () => {
    try {
      await activate(walletConnectConnector());
      setItem(LocalStorageKey.CONNECTOR, WalletConnectorName.WALLET_CONNECT);
    } catch (e) {
      console.log(e);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
      setItem(LocalStorageKey.CONNECTOR, 'null');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (account && library) {
      library.getBalance(account).then((balance: number) => {
        setEth(ethers.utils.formatEther(balance));
      });
    }
  }, [account, chainId, library]);

  return {
    eth,
    connectWalletConnect,
    connectMetamaskWallet,
    disconnectWallet,
  };
};
