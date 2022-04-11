const assert = require('assert');
const ganache = require('ganache-cli');
const { eventNames } = require('process');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());


const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach( async ()=> {
    accounts = await web3.eth.getAccounts();


factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
             .deploy({ data: compiledCampaignFactory.evm.bytecode.object }) // Then deploy Contract to network
             .send({ from: accounts[0], gas: "3000000" });
    
    
    await factory.methods.createCampaign('100').send ({
                                                  from:accounts[0],
                                                   gas: '3000000' 
                                                });
                                                

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); 

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);

    

});

describe ('Campaign', () => {
   it ('deploys a facotry and a campaigns', ()=> {
     assert.ok(factory.options.address);
     assert.ok(campaign.options.address);
   });

   it ('checks if manager is the caller', async ()=> {
        const manager = await campaign.methods.manager().call();
         assert.equal(accounts[0], manager);
   });

   it ('allows people to contribute', async () => {
       await campaign.methods.contribute().send ({
        value: '200', 
        from: accounts[1]
       });
       //const isContributor = false;
       const isContributor = await campaign.methods.approvers(accounts[1]).call();
       assert(isContributor);
   });

   it ('requres a min contribution', async ()=> {
      try {
        await campaign.methods.contribute.send({
          value: '5',
          from: accounts[1]
        });
        assert(false);
      }catch(err){
         assert(err);
      }
   });
   it ('allows manager to make a payment request', async ()=> {
             await campaign.methods
             .createRequest("Buy Batteries", "100", accounts[1])
             .send ({ 
                 from: accounts[0], 
                 gas:'1000000'
              });
   const request = await campaign.methods.requests(0).call();
   assert.equal("Buy Batteries", request.description);
   });


   it ('process request', async ()=> {
      await campaign.methods
         .contribute()
         .send({
            from: accounts[0],
            value: web3.utils.toWei('10' , 'ether')
         });
      
      await campaign.methods.createRequest('AAA', web3.utils.toWei('5', 'ether') , accounts[1])
         .send({from: accounts[0],
              gas: '1000000'
         }); 

      await campaign.methods.approveRequest(0)
         .send({from: accounts[0],
                 gas: '1000000'
              }); 
      
      await campaign.methods.finalizeRequet(0)
               .send({from: accounts[0],
                gas: '1000000'
               });        
    
      let balance = await web3.eth.getBalance(accounts[1]);
      balance = web3.utils.fromWei(balance, 'ether');
      balance = parseFloat(balance);
      console.log(balance);
      assert (balance > 104);

   
    
   });
});