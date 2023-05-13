import { TransactionRequest, Provider } from "@ethersproject/abstract-provider";
import { SigningKey } from "@ethersproject/signing-key";
import { Bytes, Signer } from "ethers";
import { Deferrable, computeAddress, hashMessage, joinSignature } from "ethers/lib/utils";

export class ExtendedECDSASigner extends Signer {
    private readonly signingKey: SigningKey;
    public readonly address: string;
    
    constructor(
        privateKey: string,
        public provider: Provider
    ) {
        super();
        this.signingKey = new SigningKey(privateKey);
        this.address = computeAddress(this.signingKey.publicKey);
    };
     
    async signMessage(message: string | Bytes): Promise<string> {
        const origSig = joinSignature(this.signingKey.signDigest(hashMessage(message)));
        const sigTypeByte = "01";
        return `0x${sigTypeByte}${origSig.slice(2)}`; // remove 0x
    }

    async getAddress(): Promise<string> {
        return this.address;
    }

    connect(provider: Provider): Signer {
        return new ExtendedECDSASigner(this.signingKey.privateKey, provider);
    }

    async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
        throw new Error("signTransaction not implemented.");
    }
}
