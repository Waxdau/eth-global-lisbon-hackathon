import { BigNumber, BigNumberish, utils } from 'ethers'
import {
  SimpleAccount,
  SimpleAccount__factory, SimpleAccountFactory,
  SimpleAccountFactory__factory
} from '@account-abstraction/contracts';
import { signer } from "@thehubbleproject/bls";

import { arrayify, hexConcat } from 'ethers/lib/utils';
import { BaseAccountAPI } from '@account-abstraction/sdk';
import { BaseApiParams } from '@account-abstraction/sdk/src/BaseAccountAPI';

/**
 * constructor params, added no top of base params:
 * @param owner the bls signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface BLSAccountApiParams extends BaseApiParams {
  blsSigner: signer.BlsSignerInterface
  factoryAddress?: string
  index?: BigNumberish

}

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class BLSAccountAPI extends BaseAccountAPI {
  factoryAddress?: string
  blsSigner: signer.BlsSignerInterface
  index: BigNumberish

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  // TODO Switch to James's new account type
  accountContract?: SimpleAccount

  // TODO Switch to James's new factory (if needed)
  factory?: SimpleAccountFactory

  constructor (params: BLSAccountApiParams) {
    super(params)
    this.factoryAddress = params.factoryAddress
    this.blsSigner = params.blsSigner
    this.index = BigNumber.from(params.index ?? 0)
  }

  async _getAccountContract (): Promise<SimpleAccount> {
    if (this.accountContract == null) {
      this.accountContract = SimpleAccount__factory.connect(await this.getAccountAddress(), this.provider)
    }
    return this.accountContract
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode (): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = SimpleAccountFactory__factory.connect(this.factoryAddress, this.provider)
      } else {
        throw new Error('no factory to get initCode')
      }
    }
    const todoAddress = "TODO need address/other data for init code";
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('createAccount', [todoAddress, this.index])
    ])
  }

  async getNonce (): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0)
    }
    const accountContract = await this._getAccountContract()
    return await accountContract.getNonce()
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute (target: string, value: BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract()
    return accountContract.interface.encodeFunctionData(
      'execute',
      [
        target,
        value,
        data
      ])
  }

  async signUserOpHash (userOpHash: string): Promise<string> {
    const msg = Buffer.from(arrayify(userOpHash)).toString("hex");
    const solG1Sig = this.blsSigner.sign(msg);

    const sigType = 0;
    return utils.defaultAbiCoder.encode(
      ["byte", "uint256[2]"],
      [sigType, solG1Sig]
    );
  }
}
