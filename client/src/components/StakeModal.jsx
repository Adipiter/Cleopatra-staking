import { useState } from 'react'

 const StakeModal = (props) => {
const {
    onClose,
    stakingLength,
    stakingPercent,
    amount,
    setAmount,
    stakeEther,
} = props

return (
    <>
    <div className= 'modal-class' onClick={props.onClose}>
        <div className= 'modal-content' onClick={e => e.stopPropagation()}>
            <div className= 'modal-body'>
            <h2 className='title-header'>Stake Ether</h2>

            <div className= 'row'>
            <div className='col-md-9 field-container'>
            <input className= 'input-field'
            placeholder='0.0'
            onChange={e => props.setAmount(e.target.value)} />
           </div>

           <div className='col-md-3 input-field-uints-container'>
           <span>ETH</span>
           </div>
           </div>

           <div className='row'>
           <h6 className='title-header staking-terms'>{stakingLength} days @ {stakingPercent} APY</h6>
           </div>

           <div className='row'>
           <div onClick={() => stakeEther}
           className='stake-button'>Stake
           </div>
           </div>
            </div>
        </div>
    </div>
    </>

);

}

export default StakeModal;