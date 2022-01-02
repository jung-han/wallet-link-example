import type { NextPage } from 'next';
import { useWeb3React } from '@web3-react/core';
import styles from '../styles/Styles.module.css';
import { useWallet } from '../hooks/useWallet';

const formatAccount = (account?: string | null) => {
  return account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '';
};

const Home: NextPage = () => {
  const { eth, disconnectWallet, connectMetamaskWallet, connectConnectWallet } = useWallet();
  const { active, account } = useWeb3React();

  return (
    <div>
      {active ? (
        <>
          <p>account: {formatAccount(account)}</p>
          <p>eth: {eth} Eth</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <>
          <button className={styles.walletItem} onClick={connectMetamaskWallet}>
            <img src="/metamask.svg" />
            <p>METAMASK</p>
          </button>
          <button className={styles.walletItem} onClick={connectConnectWallet}>
            <img src="/WalletConnect.svg" />
            <p>WALLETCONNECT</p>
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
