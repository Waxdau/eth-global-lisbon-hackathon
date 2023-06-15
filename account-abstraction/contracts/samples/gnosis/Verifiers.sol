//SPDX-License-Identifier: GPL
pragma solidity ^0.8.15;

import "../../safe-contracts/contracts/Safe.sol";
import "../../safe-contracts/contracts/examples/libraries/Migrate_1_3_0_to_1_2_0.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./EIP4337Manager.sol";
import "../bls/lib/IBLS.sol";

import "../bls/BLSSignatureAggregator.sol";

interface IVerifier {
    function verify(
        Safe safe,
        bytes32 hash,
        bytes calldata verificationData
    ) external view returns (bool);
}

contract ECDSAVerifier is IVerifier, SafeStorage {

    using ECDSA for bytes32;
    BLSSignatureAggregator blsAgg;

    constructor() {
        blsAgg = new BLSSignatureAggregator();
    }

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

    bytes32 public constant BLS_DOMAIN = bytes32(uint(0xfeedbee5));
    IBLS public immutable blsOpen;

    constructor() {
        blsOpen = IBLS(0x2a0Eed289C63F35b025Ee190AB5Bbba988F1E951);
    }
    
    function addMember(uint256[BLS_KEY_LEN] calldata newMember) public {
        groupMembers.push(newMember);
    }

    function setupGroup(uint256[BLS_KEY_LEN][] calldata newGroupMembers) public {
        groupMembers = newGroupMembers;
    }

    function verify(
        Safe safe,
        bytes32 hash,
        bytes calldata blsSignature
    ) public view returns (bool) {
        uint256[2] memory sig = abi.decode(blsSignature, (uint256[2]));
        uint256[2] memory point = blsOpen.hashToPoint(BLS_DOMAIN, abi.encodePacked(hash));

        uint256[2][] memory hashPoints = new uint256[2][](groupMembers.length);
        for (uint256 i = 0; i < groupMembers.length; i++) {
            hashPoints[i] = point;
        }

        return blsOpen.verifyMultiple(sig, groupMembers, hashPoints);
    }
}
