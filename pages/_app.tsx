import type { AppProps } from 'next/app';
import { ethers } from 'ethers';
import WalletProvider from '../wallet/provider';
import { Web3ReactProvider } from '@web3-react/core';

const getLibrary = (provider?: any) => new ethers.providers.Web3Provider(provider);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
