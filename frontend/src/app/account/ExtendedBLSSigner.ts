import { TransactionRequest, Provider } from '@ethersproject/abstract-provider';
import { mcl, signer } from '@thehubbleproject/bls';
import { Bytes, Signer } from 'ethers';
import { Deferrable, hashMessage } from 'ethers/lib/utils';

export class BLSSigner extends Signer {
  private readonly blsSigner: signer.BlsSignerInterface;

  static async create(domain: string, privateKey: string): Promise<BLSSigner> {
    const blsSignerFactory = await signer.BlsSignerFactory.new();
    return new BLSSigner(blsSignerFactory, domain, privateKey);
  }

  static async genRandPrivateKey(): Promise<string> {
    await mcl.init();
    return `0x${mcl.randFr().serializeToHexStr()}`;
  }

  constructor(
    blsSignerFactory: signer.BlsSignerFactory,
    domain: string,
    privateKey: string,
  ) {
    super();
    this.blsSigner = blsSignerFactory.getSigner(
      Buffer.from(domain),
      privateKey,
    );
  }

  async signMessage(message: string | Bytes): Promise<string> {
    const origSig = this.blsSigner.sign(hashMessage(message));
    const sigTypeByte = '02';
    return `0x${sigTypeByte}${origSig}`;
  }

  getAddress(): Promise<string> {
    throw new Error('bls keys cannot generate and address');
  }
  signTransaction(
    _transaction: Deferrable<TransactionRequest>,
  ): Promise<string> {
    throw new Error('signTransaction not implemented');
  }
  connect(_provider: Provider): Signer {
    throw new Error('connect not implemented');
  }
}
