 const NavBar = (props) => {
    return(
        <>
        <div className= 'nav-bar'>
            <div className='nav-button'>Markets</div>
            <div className= 'nav-button'>Assets</div>
            {props.isConnected() ? (
                <div className='connect-button'>Connected</div>
            ): (
                <div onClick={() => props.connect()}
                className='connect-button'>
                Connect Wallet 🦊
                </div>
            )}
        </div>
        </>
    )
}

export default NavBar;