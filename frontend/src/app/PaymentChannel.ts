import { solG1, solG2 } from '@thehubbleproject/bls/dist/mcl';
import * as io from 'io-ts';
import { signer } from '@thehubbleproject/bls';
import Channel from '../utils/Channel';
import assertType from '../utils/assertType';

export const Payment = io.type({
  token: io.string,
  to: io.string,
  amount: io.number,
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

  static encodePayment(payment: Payment) {
    // TODO: Get the actual message that needs to be signed
    return new TextEncoder().encode(JSON.stringify(payment));
  }
}
