// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../account-abstraction/contracts/samples/bls/lib/BLSOpen.sol";

struct Action {
    address to;
    uint256 value;
    bytes data;
}

contract SharedAccount {
    bytes32 BUNDLE_DOMAIN = bytes32(uint256(0xfeedbee5));

    address public owner;
    mapping(uint256 => uint256[4]) public members;
    uint256 public memberCount;

    // Key is hash((memberCount, token))
    mapping(bytes32 => uint256) public allowances;

    constructor() {
        owner = msg.sender;
    }

    function spend(
        IERC20 token,
        address to,
        uint256 amount,
        uint256 signingMembers,
        uint256[2] memory signature
    ) public {
        Action memory action = Action({
            to: to,
            value: 0,
            data: abi.encodeCall(token.transfer, (to, amount))
        });

        uint256 signingMemberCount = countSetBits(signingMembers);

        bytes32 allowanceKey = keccak256(
            abi.encode(memberCount, address(token))
        );

        uint256 allowance = allowances[allowanceKey];

        if (amount > allowance) {
            revert("Amount exceeds allowance");
        }

        uint256[4][] memory publicKeys = new uint256[4][](
            signingMemberCount
        );

        uint256 i = 0;

        for (uint256 j = 1; j < memberCount; j++) {
            if (signingMembers & (1 << j) != 0) {
                publicKeys[i] = members[j];
                i++;
            }
        }

        bool verified = verify(publicKeys, abi.encode(action), signature);

        if (!verified) {
            revert("Not verified");
        }

        token.transfer(to, amount);
    }

    function verify(
        uint256[4][] memory publicKeys,
        bytes memory message,
        uint256[2] memory signature
    ) internal returns (bool) {
        uint256[2] memory messagePoint = BLSOpen.hashToPoint(
            BUNDLE_DOMAIN,
            message
        );

        uint256[2][] memory messagePoints = new uint256[2][](publicKeys.length);

        for (uint256 i = 0; i < publicKeys.length; i++) {
            messagePoints[i] = messagePoint;
        }

        return BLSOpen.verifyMultiple(
            signature,
            publicKeys,
            messagePoints
        );
    }

    function countSetBits(uint256 x) public pure returns (uint256) {
        uint256 count;

        while (x != 0) {
            x &= x - 1;
            count++;
        }

        return count;
    }
}
