import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import artifact from './artifacts/contracts/Staking.sol/Staking.json';
import './App.css';

const CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

function App() {
  //general
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

  //assets
  const [assetIds, setAssetIds] = useState(undefined);
  const [assets, setAssets] = useState([]);

  //staking
  const [ showStakeModal, setShowStakeModal] = useState(false);
  const [stakingLength, setStakingLength] = useState('');
  const [stakingPercent, setStakingPercent] = useState('');
  const [amount, setAmount] = useState(0);

  //helper
  const toString = bytes32 => ethers.utils.parseBytes32String(bytes32)
  const toWei = ether => ethers.utils.parseEther(ether)
  const toEther = wei => ethers.utils.formatEther(wei)


useEffect(() => {
  const onLoad = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const contract = await new ethers.Contract( 
      CONTRACT_ADDRESS,
      artifact.abi

    )
    setContract(contract)
  }
  onLoad();
}, []);

  const isConnected = () => signer !== undefined;
  const getSigner = async () => {
    provider.send('eth_requestAccounts',[]);
    const signer = provider.getSigner();
    // setSigner(signer);
    return signer;
  }

  const getAssetIds = async (address, signer) => {
    const assetIds = await contract.connect(signer).getPositionIdsForAddress(address);
    return assetIds;
  }
  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() /1000;
    const secondsRemaining = unlockDate -timeNow;
    return Math.max((secondsRemaining /60 /60 /24).toFixed(0), 0);
  }

  const getAssets = async (ids, signer) => {
    const queriedAssets = await Promise.all(
      ids.map(id => contract.connect(signer).getPositionById(id))
    )
    queriedAssets.map(async asset => {
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest)/100,
        daysRemaining: calcDaysRemaining(Number(asset.unlockDate)),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
      }

      setAssets(prev => [...prev, parsedAsset])
    })
  }

  const connectAndLoad = async () => {
    const signer = await getSigner(provider)
    setSigner(signer)

    const signerAddress = await signer.getAddress()
    setSignerAddress(signerAddress)

    const assetIds = await getAssetIds(signerAddress, signer)
      setAssetIds(assetIds)

      getAssets(assetIds, signer)
    
  }

  const openStakingModal = (stakingLength, stakingPrecent) => {
    setShowStakeModal(true)
    setStakingLength(stakingLength)
    setStakingPercent(stakingPercent)
  }

  const stakeEther = () => {
    const wei = toWei(amount)
    const data = {value: wei}
    contract.connect(signer).stakeEther(stakingLength, data)
  }

  const withdraw = positionId => {
    contract.connect(signer).closePosition(positionId)
  }



  
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
