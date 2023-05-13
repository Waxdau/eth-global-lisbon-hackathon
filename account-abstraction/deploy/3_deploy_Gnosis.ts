import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deployGnosis: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  const network = await provider.getNetwork()
  // only deploy on local test network.
  if (network.chainId !== 31337 && network.chainId !== 1337) {
    return
  }

  const gsRet = await hre.deployments.deploy(
    'GnosisSafe', {
      from,
      args: [],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==GnosisSafe addr=', gsRet.address)

  const gspfRet = await hre.deployments.deploy(
    'GnosisSafeProxyFactory', {
      from,
      args: [],
      gasLimit: 6e6,
      log: true,
      deterministicDeployment: true
    })
  console.log('==GnosisSafeProxyFactory addr=', gspfRet.address)

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
    'GnosisSafeAccountFactory', {
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
  console.log('==GnosisSafeAccountFactory addr=', gsafRet.address)
}

export default deployGnosis
