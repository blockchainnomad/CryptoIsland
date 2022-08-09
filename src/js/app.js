App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load artworks.
    $.getJSON('../arts.json', function (data) {
      var artsRow = $('#artsRow');
      var artTemplate = $('#artTemplate');

      for (i = 0; i < data.length; i++) {
        artTemplate.find('.panel-title').text(data[i].name);
        artTemplate.find('img').attr('src', data[i].picture);
        artTemplate.find('.btn-buy').attr('data-id', data[i].id);

        artsRow.append(artTemplate.html());
      }
    });

    return await App.initWeb3();
    // return await App.metamaskIntalled();
  },


  initWeb3: async function () {
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

  SwitchChain: async function () {
    // Switch to Rinkeby
    try {
      const params = [{ chainId: '0x4' }]
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: params
      })
      console.log('Network is Rinkeby')
    } catch (error) {
      console.log(error)
    }
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId) // 0x4 if it's Rinkeby
    })
    return await App.initContract();
  },

  initContract: function () {
    $.getJSON('CryptoIsland.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var Artifact = data;
      App.contracts.CryptoIsland = TruffleContract(Artifact);

      // Set the provider for our contract.
      App.contracts.CryptoIsland.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },


  bindEvents: function () {
    // $(document).on('click', '#btn-buy', App.handleWatchAsset);
    $(document).on('click', '#btn-buy', App.handleMint);
  },

  handleMint: function (event) {
    event.preventDefault();

    // Request NFT
    var Instance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.CryptoIsland.deployed().then(function (instance) {
        Instance = instance;

        // return Instance.initialize({from: accounts[0]});
        // 10000000000000000 wei = 0.01 eth
        return Instance.mintNFTs(1, { from: accounts[0], value: "10000000000000000" });
      }).then(function (result) {
        alert('NFT Minting Successful!');
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

};


$(function () {
  $(window).load(function () {
    App.init();
  });
});

