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

    return await App.metamaskIntalled();
  },

  metamaskIntalled: function () {
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
    // Switch to Ropsten
    try {
      const params = [{ chainId: '0x3' }]
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: params
      })
      console.log('Network is Ropsten')
    } catch (error) {
      console.log(error)
    }
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId) // 0x3 if it's Ropsten
    })
    return await App.initContract();
  },

  initContract: function () {
    $.getJSON('../CryptoIsland.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var Artifact = data;
      App.contracts.CryptoIsland = TruffleContract(Artifact);

      // Set the provider for our contract.
      App.contracts.CryptoIsland.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },


  bindEvents: function () {
    $(document).on('click', '#btn-buy', App.handleWatchAsset);
    $(document).on('click', '#btn-buy', App.handleBuy);
  },

  handleWatchAsset: function (event) {
    event.preventDefault();

    const tokenAddress = '0xcE1961318a71695825C8cDe625CdB3986a1F49A2';
    const tokenSymbol = 'WOO';
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
    } catch (error) {
      console.log(error);
    }
  },

  handleBuy: function (event) {
    event.preventDefault();

    // Request NFT
    var Instance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      const receiver = accounts[0];

      App.contracts.CryptoIsland.deployed().then(function (instance) {
        Instance = instance;

        // return Instance.initialize({from: accounts[0]});
        return Instance.safeMint(receiver, { from: accounts[0] });
      }).then(function (result) {
        // alert('NFT Minting Successful!');
        alert('NFT Minting Successful!');
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  pagination: function () {
    let totalData; //총 데이터 수
    let dataPerPage; //한 페이지에 나타낼 글 수
    let pageCount = 10; //페이징에 나타낼 페이지 수
    let globalCurrentPage=1; //현재 페이지
    
    $(document).ready(function () {
     //dataPerPage 선택값 가져오기
     dataPerPage = $("#dataPerPage").val();
     
     $.ajax({ // ajax로 데이터 가져오기
      method: "GET",
      url: "https://url/data?" + data,
      dataType: "json",
      success: function (d) {
         //totalData 구하기
         totalData = d.data.length;
      } 
    });
     
     //글 목록 표시 호출 (테이블 생성)
     displayData(1, dataPerPage);
     
     //페이징 표시 호출
     paging(totalData, dataPerPage, pageCount, 1);
    });
  },

  paging: function (totalData, dataPerPage, pageCount, currentPage) {
    console.log("currentPage : " + currentPage);
  
    totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수
    
    if(totalPage<pageCount){
      pageCount=totalPage;
    }
    
    let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
    let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호
    
    if (last > totalPage) {
      last = totalPage;
    }
  
    let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
    let next = last + 1;
    let prev = first - 1;
  
    let pageHtml = "";
  
    if (prev > 0) {
      pageHtml += "<li><a href='#' id='prev'> 이전 </a></li>";
    }
  
   //페이징 번호 표시 
    for (var i = first; i <= last; i++) {
      if (currentPage == i) {
        pageHtml +=
          "<li class='on'><a href='#' id='" + i + "'>" + i + "</a></li>";
      } else {
        pageHtml += "<li><a href='#' id='" + i + "'>" + i + "</a></li>";
      }
    }
  
    if (last < totalPage) {
      pageHtml += "<li><a href='#' id='next'> 다음 </a></li>";
    }
  
    $("#pagingul").html(pageHtml);
    let displayCount = "";
    displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
    $("#displayCount").text(displayCount);
  
  
    //페이징 번호 클릭 이벤트 
    $("#pagingul li a").click(function () {
      let $id = $(this).attr("id");
      selectedPage = $(this).text();
  
      if ($id == "next") selectedPage = next;
      if ($id == "prev") selectedPage = prev;
      
      //전역변수에 선택한 페이지 번호를 담는다...
      globalCurrentPage = selectedPage;
      //페이징 표시 재호출
      paging(totalData, dataPerPage, pageCount, selectedPage);
      //글 목록 표시 재호출
      displayData(selectedPage, dataPerPage);
    });
  },

  //현재 페이지(currentPage)와 페이지당 글 개수(dataPerPage) 반영
displayData: function (currentPage, dataPerPage) {

  let chartHtml = "";

//Number로 변환하지 않으면 아래에서 +를 할 경우 스트링 결합이 되어버림.. 
  currentPage = Number(currentPage);
  dataPerPage = Number(dataPerPage);
  
  for (
    var i = (currentPage - 1) * dataPerPage;
    i < (currentPage - 1) * dataPerPage + dataPerPage;
    i++
  ) {
    chartHtml +=
      "<tr><td>" +
      dataList[i].d1 +
      "</td><td>" +
      dataList[i].d2 +
      "</td><td>" +
      dataList[i].d3 +
      "</td></tr>";
  } //dataList는 임의의 데이터임.. 각 소스에 맞게 변수를 넣어주면 됨...
  $("#dataTableBody").html(chartHtml);
}
};


$(function () {
  $(window).load(function () {
    App.init();
  });
});

$("#dataPerPage").change(function () {
  dataPerPage = $("#dataPerPage").val();
  //전역 변수에 담긴 globalCurrent 값을 이용하여 페이지 이동없이 글 표시개수 변경 
  paging(totalData, dataPerPage, pageCount, globalCurrentPage);
  displayData(globalCurrentPage, dataPerPage);
});

