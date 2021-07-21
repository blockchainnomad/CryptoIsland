App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load artworks.
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

    return await App.initWeb3();
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
    // Legacy dapp browsers...
    else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
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
      return App.markPurchased();
    });

    $.getJSON('NFToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var NFTokenArtifact = data;
      App.contracts.NFToken = TruffleContract(NFTokenArtifact);

      // Set the provider for our contract.
      App.contracts.NFToken.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },

  markPurchased: function() {
    var purchaseInstance;

    App.contracts.Purchase.deployed().then(function(instance) {
      purchaseInstance = instance;

      return purchaseInstance.getBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-art').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  bindEvents: function() {
    $(document).on('click', '#btn-buy', App.handleWatchAsset);
    $(document).on('click', '#btn-buy', App.handleBuy);
  },

  handleWatchAsset: function(event) {
    event.preventDefault();

    const tokenAddress = '0x457017658a85d96e23b14a6e28eff1a40c85bb0f';
    const tokenSymbol = 'NFT';
    const tokenDecimals = 0.1;
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

    // Request Buy Transaction
    var artId = parseInt($(event.target).data('id'));
    var purchaseInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Purchase.deployed().then(function(instance) {
        purchaseInstance = instance;

        // Execute buy as a transaction by sending account
        return purchaseInstance.buy(artId, {from: account});
      }).then(function(result) {
        return App.markPurchased();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

    // Request NFT
    var NFTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var amount = web3.toWei('0.01','ether')

      App.contracts.NFToken.deployed().then(function(instance) {
        NFTokenInstance = instance;

        return NFTokenInstance.buyToken(1,"NFT",{from: account, value: amount});
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
