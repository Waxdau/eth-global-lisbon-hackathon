import { once } from '@s-libs/micro-dash';
import { signer } from '@thehubbleproject/bls';
import blsDomain from './blsDomain';
import { BigNumber, Wallet, ethers } from 'ethers';
import PaymentChannel, { Payment } from './PaymentChannel';
import { useEffect, useState } from 'react';
import { wrapProvider } from './account/wrapProvider';
import { ERC4337EthersProvider } from '@account-abstraction/sdk';
import makeId from './utils/makeId';
// import TestToken from './ERC20/TestToken.json';
import { ExtendedECDSASigner } from './account/ExtendedECDSASigner';

// aaProvider!.smartAccountAPI.getUserOpHash()
// encode

export default class AppContext {
  static getSingleton = once(async () => {
    // Calls mcl.init underneath. Some unrelated operations also need this.
    const signerFactory = await signer.BlsSignerFactory.new();

    let seedId = localStorage.getItem('seed-id');

    if (seedId === null) {
      seedId = makeId();
      localStorage.setItem('seed-id', seedId);
    }

    const hardHatPrivateKey =
      '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
    const aaPrivateKey =
      '0x8d011e5c49dfeebde11b597b77f1a363968a376bd97c5dc716c3b2c111d1ec56';
    const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
    const bundlerUrl = 'http://localhost:3000/rpc';
    const rpcUrl = 'http://localhost:8545';

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
      name: 'localhost',
      chainId: 31337,
    });
    const hhSigner = new Wallet(hardHatPrivateKey, provider);

    const aaSigner = new ExtendedECDSASigner(aaPrivateKey, provider);
    const tempAaProvider = await wrapProvider(
      provider,
      {
        entryPointAddress,
        bundlerUrl,
      },
      aaSigner,
    );

    const balance = await tempAaProvider.getBalance(
      await tempAaProvider.getSigner().getAddress(),
    );

    console.log('aabalance address: ', {
      balance,
      address: aaSigner.address,
    });

    const hhBalance = await provider.getBalance(hhSigner.address);

    return new AppContext(
      hardHatPrivateKey,
      aaPrivateKey,
      entryPointAddress,
      bundlerUrl,
      rpcUrl,
      provider,
      hhSigner,
      hhBalance,
      balance,
      tempAaProvider,
      await tempAaProvider.getSigner().getAddress(),
      signerFactory.getSigner(
        blsDomain,
        ethers.utils.hexlify(new TextEncoder().encode(seedId)),
      ),
    );
  });

  static use = () => {
    const [appContext, setAppContext] = useState<AppContext>();

    useEffect(() => {
      AppContext.getSingleton().then(setAppContext);
    }, []);

    return appContext;
  };

  walletAddress: string | undefined;

  constructor(
    public hardHatPrivateKey: string,
    public aaPrivateKey: string,
    public entryPointAddress: string,
    public bundlerUrl: string,
    public rpcUrl: string,
    public provider: ethers.providers.Provider,
    public hhSigner: Wallet,
    public hhBalance: BigNumber,
    public balance: BigNumber,
    public aaProvider: ERC4337EthersProvider,
    public address: string,
    public signer: signer.BlsSignerInterface,
  ) {
    this.walletAddress = localStorage.getItem('wallet-address') ?? undefined;
  }

  async fundWallet() {
    const accountAddress = await this.aaProvider.getSigner().getAddress();
    console.log('Funding wallet', accountAddress);
    const tx = await this.hhSigner.sendTransaction({
      to: accountAddress,
      value: ethers.utils.parseEther('1.0'),
    });
    await tx.wait();
    console.log('tx complete');
  }

  createPayment(
    simplePayment: Pick<Payment, 'to' | 'amount' | 'description'>,
  ): Payment {
    if (this.walletAddress === undefined) {
      alert('No wallet to send from');
      throw new Error('No wallet to send from');
    }

    return {
      sender: this.walletAddress,
      nonce: '0x00', // TODO: nonce
      // token: TestToken.address, // TODO: token
      token: '0x' + '01'.repeat(20),
      ...simplePayment,
    };
  }

  async addSignature(paymentChannel: PaymentChannel, payment: Payment) {
    const encodedPayment = await PaymentChannel.encodePayment(
      payment,
      this.aaProvider,
    );

    const signature = this.signer.sign(encodedPayment);

    await paymentChannel.addSignature(this.signer.pubkey, signature);
  }

  static setWalletAddress(address: string) {
    localStorage.setItem('wallet-address', address);
  }
}
