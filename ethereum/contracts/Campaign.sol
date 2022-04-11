// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract CampaignFactory {
     address [] public deployedCampaigns;
 
    function createCampaign(uint _minimum) public{
        address newCampaign = address (new Campaign(_minimum, msg.sender));

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory)    {
        return deployedCampaigns;
    }

}

contract Campaign {
    struct Requests {
        string  description;
        uint value;
        address payable recepient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool) approvals;

    }
    
    Requests[] public requests;
    uint numberOfRequests;
    address public manager;
    uint minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;



    modifier restricted(){
        require (msg.sender == manager);
        _;
    }

    constructor(uint _minContribution, address creator) {
       manager= creator;
       minContribution=_minContribution; 
    }

    function contribute() public payable{
        require(msg.value>minContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory _description, uint value, address payable _recepient) public restricted {
         

        Requests storage request = requests.push();
        request.description=_description;
        request.value=value;
        request.recepient=_recepient;
        request.complete=false;
        request.approvalCount=0;

         
      }


      function approveRequest(uint index) public restricted{

        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;

      }   

      function finalizeRequet(uint index) public restricted{
         Requests storage request = requests[index];

         require (!request.complete);
         require (request.approvalCount > approversCount/2);
         request.recepient.transfer(request.value);
         request.complete=true; 
      
      }     
      function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
          return (
            minContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
          );
      }
      function getRequestsCount() public view returns(uint) {
          return requests.length;
          
      } 
}