import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, '0xA13d623A2720119331D64585bfe4028a9df7cC40');
export default instance;