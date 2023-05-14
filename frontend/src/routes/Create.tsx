import NewTransactionButton from '../components/NewTransactionButton';
import '../debug';
import CreateWalletForm from '../components/CreateWalletForm';
import AppContext from '../AppContext';

import { ethers } from 'ethers';

export default function Create() {
  return (
    <div className="home">
      <CreateWalletForm />
    </div>
  );
}
