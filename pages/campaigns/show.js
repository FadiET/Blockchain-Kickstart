import React, { Component } from "react";
import {Card, Grid, Button} from 'semantic-ui-react';
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributForm from "../../components/contributeForm";
import {Link} from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    console.log(summary);

    return { 
            address: props.query.address,
            minContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
    };
  }
  
  renderCards() {
    const {
      balance,
      manager,
      minContribution,
      requestsCount,
      approversCount
    } = this.props;
    
    const items = [
      {
        header: manager,
        meta:'Adress of Manager',
        description: 'Manager created this campaign and can create requests',
        style: {overflowWrap:'break-word'}
       
      },

      {
        header: minContribution,
        meta:'Minimum Contribution (WEI)',
        description: 'You must contribute at least this much to become an approver',
      },
      {
        header: requestsCount,
        meta:'Number of Requests',
        description: 'A request to withdraw money from the campaign',
      },
      {
        header: approversCount,
        meta:'Number of Approvers',
        description: 'Number of people that donated to the campaign and can approve a request',
      } ,
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta:'The Balance of Campaign',
        description: 'The balance of Campaign in Ether!'
      } 

     ] ;
     return <Card.Group items={items}/>;



  }

  render() {
    return (
      <Layout>

        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
          <Grid.Column width = '10'>
            {this.renderCards()}
            </Grid.Column>

          <Grid.Column width = '6'>
            <ContributForm address={this.props.address} />
          </Grid.Column>
          </Grid.Row>
          <Grid.Row>
             <Grid.Column>
             <Link route={`/campaigns/${this.props.address}/requests`}>
             <a>
               <Button primary>View Requests</Button>
             </a>
            </Link>
             </Grid.Column>

          </Grid.Row>
        </Grid>

                  
        
      </Layout>
    );
  }
}

export default CampaignShow;