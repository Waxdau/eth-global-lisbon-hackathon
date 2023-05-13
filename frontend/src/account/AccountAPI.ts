import { BigNumber, BigNumberish } from 'ethers';
import {
  GnosisSafeProxy,
  GnosisSafeProxy__factory,
  GnosisSafeAccountFactory,
  GnosisSafeAccountFactory__factory,
  EIP4337Manager,
  EIP4337Manager__factory,
  UserOperationStruct,
} from 'account-abstraction';

import { arrayify, hexConcat } from 'ethers/lib/utils';
import { Signer } from '@ethersproject/abstract-signer';
import { BaseAccountAPI } from '@account-abstraction/sdk';
import { BaseApiParams } from '@account-abstraction/sdk/src/BaseAccountAPI';
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/src/TransactionDetailsForUserOp';

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface AccountApiParams extends BaseApiParams {
  eip4337ManagerAddress: string;
  gnosisSafeAccountFactoryAddress: string;
  owner: Signer;
  index?: BigNumberish;
}

/**
 * An implementation of the BaseAccountAPI using the Gnosis Safe contracts.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class AccountAPI extends BaseAccountAPI {
  eip4337Manager: EIP4337Manager;
  gnosisSafeAccountFactory: GnosisSafeAccountFactory;
  owner: Signer;
  index: BigNumberish;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: GnosisSafeProxy;

  constructor(params: AccountApiParams) {
    super(params);
    this.owner = params.owner;
    this.index = BigNumber.from(params.index ?? 0);

    this.eip4337Manager = EIP4337Manager__factory.connect(
      params.eip4337ManagerAddress,
      this.provider,
    );
    this.gnosisSafeAccountFactory = GnosisSafeAccountFactory__factory.connect(
      params.gnosisSafeAccountFactoryAddress,
      this.provider,
    );
  }

  async _getAccountContract(): Promise<GnosisSafeProxy> {
    if (this.accountContract == null) {
      this.accountContract = GnosisSafeProxy__factory.connect(
        await this.getAccountAddress(),
        this.provider,
      );
    }
    return this.accountContract;
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    return hexConcat([
      this.gnosisSafeAccountFactory.address,
      this.gnosisSafeAccountFactory.interface.encodeFunctionData(
        'createAccount',
        [await this.owner.getAddress(), this.index],
      ),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    return await accountContract.getNonce();
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string,
  ): Promise<string> {
    return this.eip4337Manager.interface.encodeFunctionData(
      'executeAndRevert',
      [
        target,
        value,
        data,
        0, // Enum.Operation.Call
      ],
    );
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.owner.signMessage(arrayify(userOpHash));
  }

  override async createUnsignedUserOp(
    info: TransactionDetailsForUserOp,
  ): Promise<UserOperationStruct> {
    const unsignedOp = await super.createUnsignedUserOp(info);
    console.debug('orig unsigned user op', unsignedOp);
    const newUnsignedOp = {
      ...unsignedOp,
      preVerificationGas: BigNumber.from(
        await unsignedOp.preVerificationGas,
      ).mul(2),
    };
    console.debug('new unsigned user op', newUnsignedOp);
    return newUnsignedOp;
  }
}
