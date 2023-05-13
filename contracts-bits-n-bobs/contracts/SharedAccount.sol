// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Action {
    address to;
    uint256 value;
    bytes data;
}

contract SharedAccount {
    address public owner;
    mapping(uint256 => uint256[4]) public members;
    uint256 public memberCount;

    // Key is hash((sigCount, token))
    mapping(bytes32 => uint256) public allowances;

    constructor() {
        owner = msg.sender;
    }

    function spend(
        uint8 signersBitField,
        IERC20 token,
        address to,
        uint256 amount
    ) public {
        uint256 sigCount = countBitField(signersBitField);

        bytes32 allowanceKey = keccak256(
            abi.encode(sigCount, address(token))
        );

        uint256 allowance = allowances[allowanceKey];

        if (amount > allowance) {
            revert("Amount exceeds allowance");
        }

        token.transfer(to, amount);
    }

    function countBitField(uint8 x) public pure returns (uint256) {
        uint256 count;

        while (x != 0) {
            x &= x - 1;
            count++;
        }

        return count;
    }
}
