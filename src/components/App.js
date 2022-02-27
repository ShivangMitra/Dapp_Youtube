import React, { useEffect, useState } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App() {

  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState('')
  const [videos, setVideos] = useState([])
  const [latest, setLatest] = useState({})
  const [buffer, setBuffer] = useState()
  const [contract, setContract] = useState()

  useEffect(() => {

    let web3

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.ethereum.enable()
      .then(data => {
        web3 = window.web3
        getBlockchainData(web3)
      })
      .catch(err => console.log(err))
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      web3 = window.web3
      getBlockchainData(web3)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      setLoading(false)
    }
  }, [])

  function getBlockchainData(web3){

    web3.eth.getAccounts()
    .then(accounts => {
      setAccount(accounts[0])

      web3.eth.net.getId()
      .then(networkId => {
        const networkData = DVideo.networks[networkId]
        if(networkData){
          const contract = new web3.eth.Contract(DVideo.abi, networkData.address)

          setContract(contract)

          contract.methods.videoCount().call()
          .then(videosCount => {

            let tempVideos = videos

            for(let i=1; i<=videosCount; i++){
              contract.methods.videos(i).call()
              .then(video =>{
                tempVideos.push(video)

                if(i === videosCount){
                  setVideos([...tempVideos])
                }
              })
              .catch(err => console.log(err))
            }

            contract.methods.videos(videosCount).call()
            .then(latest => {
              setLatest({
                currentHash: latest.hashVal,
                currentTitle: latest.title
              })
            })
            .catch(err => console.log(err))

            setLoading(false)
          })


        }
        else{
          window.alert('DVideo contract has not been deployed to the detected network')
        }
      })
      .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
  }

  function captureFile(e){
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result))
      console.log('Buffer : ', Buffer(reader.result))
    }
  }

  function uploadVideo(title){

    setLoading(true)

    console.log("Submitting file to IPFS...")

    ipfs.add(buffer, (err, res) => {

      console.log('IPFS result', res)

      contract.methods.uploadVideo(res[0].hash, title).send({
        from: account
      })
      .on('transactionHash', (hash) => {
        setLoading(false)
      })

      if(err){
        console.log(err)
      }

    })
  }

  function changeVideo(hash, title){
    setLatest({
      currentHash: hash,
      currentTitle: title
    })
  }

  return (
    <div>
        <Navbar 
          account={account}
        />
        { loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              captureFile={captureFile}
              uploadVideo={uploadVideo}
              changeVideo={changeVideo}
              latest={latest}
              videos={videos}
            />
        }
      </div>
  )
}

export default App
