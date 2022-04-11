const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider (
    'pride first park please expire gospel turkey response boring stuff sport chef',
    'https://rinkeby.infura.io/v3/f47fefe389ba42c6ab32855dd9a99a62'
 );

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account...', accounts[0]);
    const result = await new web3.eth.Contract(compiledFactory.abi)
             .deploy({ data:'0x' +  compiledFactory.evm.bytecode.object})              //, arguments: ['Hi Fadi'] })
             .send ({from: accounts[0]});
    
    //console.log(abi)
    console.log('deployed to:', result.options.address);
    provider.engine.stop();
}
deploy();