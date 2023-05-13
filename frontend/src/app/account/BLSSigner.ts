import { TransactionRequest, Provider } from "@ethersproject/abstract-provider";
import { signer } from '@thehubbleproject/bls';
import { Bytes, Signer } from "ethers";
import { Deferrable } from "ethers/lib/utils";

const getBLSSigner = async (): Promise<signer.BlsSignerInterface> => {
    const privateKey = '0xabc123';
    const domain = 'notthebeeeeeeees';
  
    const blsSignerFactory = await signer.BlsSignerFactory.new();
    return blsSignerFactory.getSigner(Buffer.from(domain), privateKey);
  };

export class BLSSigner extends Signer {
    getAddress(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    signMessage(message: string | Bytes): Promise<string> {
        throw new Error("Method not implemented.");
    }
    signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    connect(provider: Provider): Signer {
        throw new Error("Method not implemented.");
    }

}
