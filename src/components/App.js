import React, { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'

import ColorPicker from '../abis/ColorPicker.json'
import { contrastingColor } from '../modules/color'
import Notifications from './Notifications'
import Header from './Header'
import Bio from './Bio'
import ColorPickerForm from './ColorPickerForm' 
import Confetti from './Confetti'
import '../styles/App.css'

const App = () => {
  // We keep data that affects rendering in component state
  const [account, setAccount] = useState('')
  const [weiCostString, setWeiCostString] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [newBackgroundColor, setNewBackgroundColor] = useState('#ffffff')
  const [announcement, setAnnouncement] = useState(null)
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)

  // We keep data that does not affect rendering outside of component state
  // to avoid unnecessary rendering
  const colorPickerContract = useRef(null)
  const walletLoaded = useRef(false)

  const getContractData = async (web3) => {
    const networkId = await web3.eth.net.getId()
    return ColorPicker.networks[networkId]
  }

  const initialize = async () => {
    // set up websocket connection with infura and get current background color
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        `wss://mainnet.infura.io/ws/v3/${process.env.REACT_APP_INFURA_KEY}`
      )
    )

    const colorPickerData = await getContractData(web3)
    if (colorPickerData) {
      // get ColorPicker instance
      const infuraColorPickerInstance = new web3.eth.Contract(ColorPicker.abi, colorPickerData.address)

      // listen for events
      infuraColorPickerInstance.events.ColorChanged()
        .on('data', processEvent)
        .on('error', console.error)
      
      // read latest background color from the contract instance
      const latestBackgroundColor = await infuraColorPickerInstance.methods.getColor().call()
      setBackgroundColor(latestBackgroundColor.replace('0x', '#'))

      // read latest update cost from the contract instance
      const latestCostInWeiString = await infuraColorPickerInstance.methods.getCost().call()
      setWeiCostString(latestCostInWeiString)
    }
  }

  const processEvent = (event) => {
    setAnnouncement({
      account: event.returnValues._from.toString(),
      color: event.returnValues._newColor.toString().slice(0, 8).replace('0x', '#'),
      weiCostString: event.returnValues.cost.toString(),
      transactionHash: event.transactionHash
    })
  }

  const handleSetColorClick = async () => {
    if (typeof window === 'undefined') return
    let userAccount = account
    let colorPickerInstance = colorPickerContract.current
    if (!walletLoaded.current) {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
      walletLoaded.current = true
    }

    const colorPickerData = await getContractData(window.web3)
    if (colorPickerData) {
      colorPickerInstance = new window.web3.eth.Contract(ColorPicker.abi, colorPickerData.address)
      colorPickerContract.current = colorPickerInstance
    }

    if (!account) {
      const accounts = await window.web3.eth.getAccounts()
      userAccount = accounts[0]
      setAccount(userAccount)
    }

    const hexColor = window.web3.utils.toHex(newBackgroundColor.replace('#', '0x'))
    colorPickerInstance.methods.setColor(hexColor).send({
      from: userAccount,
      value: weiCostString
    }).on('transactionHash', (transactionHash) => {
      setPendingTransactions([...pendingTransactions, transactionHash])
    }).on('error', console.error)
  }

  useEffect(() => {
    initialize()
  }, [])
  
  useEffect(() => {
    const newForegroundColor = contrastingColor(backgroundColor)
    if (foregroundColor !== newForegroundColor) {
      setForegroundColor(newForegroundColor)
    }
    setNewBackgroundColor(backgroundColor)
  }, [backgroundColor])

  useEffect(() => {
    if (!announcement) return
    setBackgroundColor(announcement.color)
  }, [announcement])

  useEffect(() => {
    if (!announcement || !pendingTransactions || !pendingTransactions.length) return
    if (pendingTransactions.includes(announcement.transactionHash)) {
      const newPendingTransactions = [...pendingTransactions]
      newPendingTransactions.splice(newPendingTransactions.indexOf(announcement.transactionHash), 1)
      setPendingTransactions(newPendingTransactions)
      setShowConfetti(true)
    }
  }, [announcement, pendingTransactions])

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false)
      }, 100)
    }
  }, [showConfetti])

  return (
    <article style={{ backgroundColor, color: foregroundColor }}>
      {(Boolean(announcement) || Boolean(pendingTransactions.length)) && (
        <Notifications
          announcement={announcement}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          pendingTransactions={pendingTransactions}
        />
      )}
      <Header foregroundColor={foregroundColor} />
      <Bio />
      {weiCostString && <ColorPickerForm
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        newColor={newBackgroundColor}
        weiCostString={weiCostString}
        setNewColor={setNewBackgroundColor}
        onSetColorClick={handleSetColorClick}
      />}
      <Confetti trigger={showConfetti} />
    </article>
  )
}

export default App
