App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // arts.json으로부터 작품 불러오기
    $.getJSON('../arts.json', function (data) {
      var artsRow = $('#artsRow');
      var artTemplate = $('#artTemplate');

      for (i = 0; i < data.length; i++) {
        artTemplate.find('.panel-title').text(data[i].name);
        artTemplate.find('img').attr('src', data[i].image);
        artTemplate.find('.btn-mint').attr('data-id', data[i].tokenId);

        artsRow.append(artTemplate.html());
      }
    });

    return await App.initWeb3();
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
    // Switch to Goerli
    try {
      const params = [{ chainId: '0x5' }]
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: params
      })
      console.log('Network is Goerli')
    } catch (error) {
      console.log(error)
    }
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId) // 0x5 = Goerli
    })
    return await App.initContract();
  },

  initContract: function () {
    $.getJSON('CryptoIsland.json', function (data) {
      // 컨트랙트 json 파일을 가져온 후 TruffleContract의 인자로 넣어준다.
      var Artifact = data;
      App.contracts.CryptoIsland = TruffleContract(Artifact);

      // web3 프로바이더를 설정한다
      App.contracts.CryptoIsland.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-mint', App.handleMint);
  },


  handleMint: function (event) {
    event.preventDefault();

    // 버튼을 클릭하면 id를 가져와서 artId 변수에 저장한다.
    const tokenId = parseInt($(event.target).data('id'));

    // NFT를 요청한다.
    let Instance;

    // web3 프로바이더로부터 계정 정보를 요청한다.
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      let account = accounts[0];

      App.contracts.CryptoIsland.deployed().then(async function (instance) {
        Instance = instance;

        // 10000000000000000 wei = 0.01 eth
        let nftTx = await Instance.safeMint(account, { from: account });

        return nftTx;

      }).then(function (nftTx) {
        console.log('tokenId', tokenId)

        // // 민팅된 작품의 버튼은 Minted 표시로 바꾼다. 버튼 순서는 tokenId에 따른다.
        $('.panel-body').eq(tokenId).find('button').text('Minted').attr('disabled', true);

        console.log(`https://goerli.etherscan.io/tx/${nftTx.tx}`)

        alert(`Minting is Successful!`);

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

