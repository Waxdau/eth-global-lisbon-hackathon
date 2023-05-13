import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deploySafe: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  const network = await provider.getNetwork()
  // only deploy on local test network.
  if (network.chainId !== 31337 && network.chainId !== 1337) {
    return
  }

  const gsRet = await hre.deployments.deploy(
    'Safe', {
      from,
      args: [],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==Safe addr=', gsRet.address)

  const gspfRet = await hre.deployments.deploy(
    'SafeProxyFactory', {
      from,
      args: [],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==SafeProxyFactory addr=', gspfRet.address)

  const entrypoint = await hre.deployments.get('EntryPoint')
  const managerRet = await hre.deployments.deploy(
    'EIP4337Manager', {
      from,
      args: [entrypoint.address],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==EIP4337Manager addr=', gspfRet.address)

  const gsafRet = await hre.deployments.deploy(
    'SafeAccountFactory', {
      from,
      args: [
        gspfRet.address,
        gsRet.address,
        managerRet.address,
      ],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==SafeAccountFactory addr=', gsafRet.address)
}

export default deploySafe
