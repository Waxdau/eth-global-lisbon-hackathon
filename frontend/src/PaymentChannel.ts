import { solG1, solG2 } from '@thehubbleproject/bls/dist/mcl';
import * as io from 'io-ts';
import { signer } from '@thehubbleproject/bls';
import Channel from './utils/Channel';
import assertType from './utils/assertType';
import { ERC4337EthersProvider } from '@account-abstraction/sdk';
import { IERC20__factory } from './ERC20/IERC20__factory';

const callGasLimit = '1000000';
const verificationGasLimit = '1000000';
const preVerificationGas = '1000000';
const maxFeePerGas = '100000000000'; // 100 gwei
const maxPriorityFeePerGas = '1000000000'; // 1 gwei

export const Payment = io.type({
  sender: io.string,
  nonce: io.string,
  token: io.string,
  to: io.string,
  amount: io.string,
  description: io.string,
});

export type Payment = io.TypeOf<typeof Payment>;

export type SignedPayment = {
  publicKeys: solG2[];
  payment: Payment;
  signature: solG1;
};

const SignatureMessage = io.type({
  publicKey: io.tuple([io.string, io.string, io.string, io.string]),
  signature: io.tuple([io.string, io.string]),
});

export default class PaymentChannel {
  channel: Channel;

  constructor(public id: string) {
    this.channel = new Channel(id);
  }

  static async create(payment: Payment) {
    assertType(payment, Payment);
    const channel = await Channel.create();
    await channel.push(payment);

    return new PaymentChannel(channel.id);
  }

  async getPayment(): Promise<Payment> {
    const messages = await this.channel.get();

    const payment = messages[1];
    assertType(payment, Payment);

    return payment;
  }

  async addSignature(publicKey: solG2, signature: solG1) {
    await this.channel.push({ publicKey, signature });
  }

  async getSignedPayment(): Promise<SignedPayment> {
    const messages = await this.channel.get();

    const payment = messages[1];
    assertType(payment, Payment);

    const signatureMessages = messages.slice(2);
    const publicKeys: solG2[] = [];
    const signatures: solG1[] = [];

    for (const signatureMessage of signatureMessages) {
      assertType(signatureMessage, SignatureMessage);

      const { publicKey, signature } = signatureMessage;

      publicKeys.push(publicKey);
      signatures.push(signature);
    }

    return {
      publicKeys,
      payment,
      signature: signer.aggregate(signatures),
    };
  }

  static async encodePayment(
    payment: Payment,
    aaProvider: ERC4337EthersProvider,
  ) {
    const callData = await aaProvider.smartAccountAPI.encodeExecute(
      payment.token,
      0,
      IERC20__factory.createInterface().encodeFunctionData('transfer', [
        payment.to,
        payment.amount,
      ]),
    );

    const userOpHash = await aaProvider.smartAccountAPI.getUserOpHash({
      sender: payment.sender,
      nonce: payment.nonce,
      initCode: '0x',
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData: '0x',
      signature: '0x',
    });

    return userOpHash;
  }
}
