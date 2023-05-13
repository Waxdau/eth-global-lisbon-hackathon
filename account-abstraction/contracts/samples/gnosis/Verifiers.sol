//SPDX-License-Identifier: GPL
pragma solidity ^0.8.15;

import "../../safe-contracts/contracts/Safe.sol";
import "../../safe-contracts/contracts/examples/libraries/Migrate_1_3_0_to_1_2_0.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./EIP4337Manager.sol";

interface IVerifier {
    function verify(
        Safe safe,
        bytes32 hash,
        bytes calldata verificationData
    ) external view returns (bool);
}

contract ECDSAVerifier is IVerifier, SafeStorage {

    using ECDSA for bytes32;

    function verify(
        Safe safe,
        bytes32 hash,
        bytes calldata ecdsaSignature
    ) public view returns (bool) {
        bytes32 msgHash = hash.toEthSignedMessageHash();
        address recovered = msgHash.recover(ecdsaSignature);
        return safe.isOwner(recovered);
    }
}

contract BLSGroupVerifier is IVerifier, SafeStorage {
    uint8 public constant BLS_KEY_LEN = 4;
    uint256[BLS_KEY_LEN][] public groupMembers;
    
    function addMember(uint256[BLS_KEY_LEN] calldata newMember) public {
        groupMembers.push(newMember);
    }

    function setupGroup(uint256[BLS_KEY_LEN][] calldata newMember) public {
        //add members
    }

    function verify(
        Safe safe,
        bytes32 hash,
        bytes calldata ecdsaSignature
    ) public pure returns (bool) {
        (safe); (hash); (ecdsaSignature);
        return true;
    }
}
