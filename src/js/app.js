App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // $("#total").load("../balance.txt","document.querySelector('#last_last')", function(){
    //   var totalBalance = $('#total');
    // });

    $("#total").load('../balance.txt');

    

    // Load artworks.`'
    $.getJSON('../arts.json', function(data) {
      var artsRow = $('#artsRow');
      var artTemplate = $('#artTemplate');

      for (i = 0; i < data.length; i ++) {
        artTemplate.find('.panel-title').text(data[i].name);
        artTemplate.find('img').attr('src', data[i].picture);
        artTemplate.find('.btn-buy').attr('data-id', data[i].id);

        artsRow.append(artTemplate.html());
      }
    });

    return await App.metamaskIntalled();
  },

  metamaskIntalled: function() {
        if (window.ethereum) {
            handleEthereum();
          } else {
            window.addEventListener('ethereum#initialized', handleEthereum, {
              once: true,
            });
          
            // If the event is not dispatched by the end of the timeout,
            // the user probably doesn't have MetaMask installed.
            setTimeout(handleEthereum, 3000); // 3 seconds
          }
          
          function handleEthereum() {
            const { ethereum } = window;
            if (ethereum && ethereum.isMetaMask) {
              console.log('Ethereum successfully detected!');
              // Access the decentralized web!
            } else {
              console.log('Please install MetaMask!');
              window.open().location.replace("https://metamask.io");
          }
          return App.initWeb3();
        }
      },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    
    return await App.SwitchChain();
  },

  SwitchChain: async function() {
    // Switch to Ropsten
    try {
      const params = [{ chainId: '0x3' }]
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: params
      })
      console.log('Network is Ropsten')
    } catch(error) {
      console.log(error)
    }
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId) // 0x3 if it's Ropsten
    })
      return await App.initContract();
  },

  initContract: function() {
    $.getJSON('CryptoIsland.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var BuyArtifact = data;
      App.contracts.Purchase = TruffleContract(BuyArtifact);
    
      // Set the provider for our contract
      App.contracts.Purchase.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the arts purchased
      // return App.markPurchased();
    });

    $.getJSON('CryptoIslandToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var NFTArtifact = data;
      App.contracts.CryptoIslandToken = TruffleContract(NFTArtifact);

      // Set the provider for our contract.
      App.contracts.CryptoIslandToken.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '#btn-buy', App.handleWatchAsset);
    $(document).on('click', '#btn-buy', App.handleBuy);
  },

  handleWatchAsset: function(event) {
    event.preventDefault();

    const tokenAddress = '0xb5b1be487d64be9aD7E1A38b6Da75Bbb6C970d03';
    const tokenSymbol = 'WOO';
    const tokenDecimals = 18;
    const tokenImage = 'https://i.imgur.com/HhkhMwy.jpg';
    
    try {
      const AddNFT = ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage
            },
          },
    });
    } catch(error) {
      console.log(error);
    }
  },

  handleBuy: function(event) {
    event.preventDefault();

    // Request NFT
    var NFTInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      const sender = 0x930299393b940aD1824c87c9F8fBc71405E8bad2;
      const receiver = accounts[0];
      const amount = 0
      const tokenId = 1
      const tokenURI = "https://ipfs.io/ipfs/QmTnKm4QhY8XEorHvKC2R1FkZK6MyZsXu3n2UmHCkUfLx3"

      App.contracts.CryptoIslandToken.deployed().then(function(instance) {
        NFTInstance = instance;

        return NFTInstance.transferFrom(sender, receiver, amount, {from: accounts[0]});
      }).then(function(result) {
        alert('NFT Transfer Successful!');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


