// @flow
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Grid, Menu, Divider, Segment, Header } from 'semantic-ui-react';
import { formatPattern } from 'react-router';
import campaignUri from '../../modules/Campaign/uri';
import LoginForm from '../../modules/Security/components/LoginForm';
import type { StateType } from '../../types/redux';
import * as securityActions from '../../modules/Security/actions/handlers';

type RouteParamsType = {
  campaign: number
}

type PropsType = {
  children: React.Element<*>,
  routeParams: RouteParamsType,
  isAuthenticated: boolean,
  securityActions: {
    login: (email: string, password: string) => void,
    logout: () => void
  }
}

class CoreLayout extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  props: PropsType

  onLogin = (email: string, password: string) => {
    this.props.securityActions.login(email, password);
  }

  onLogout = () => {
    this.props.securityActions.logout();
  }

  onAddCampaignClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(campaignUri.add));
  };

  onCampaignsClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(campaignUri.list));
  };

  render() {
    const { children, routeParams, isAuthenticated } = this.props;

    return isAuthenticated ? <div>
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={16} className="top-nav">
            <Container>
              <Menu inverted={true} size="small" className="head" borderless={true}>
                <Menu.Item>
                  <h4 className="logo">Notify<span className="subtext">Monitor</span></h4>
                </Menu.Item>
                <Menu.Item name="home" active={this.context.router.location.pathname.startsWith('/campaigns')} onClick={this.onCampaignsClick}>
                  <span>Campaigns</span>
                </Menu.Item>
                <Menu.Item name="testimonials" active={this.context.router.isActive(campaignUri.add)} className="add-campaign" onClick={this.onAddCampaignClick}>
                  Add Campaign
                  {' '}
                </Menu.Item>
                <Menu.Item name="testimonials" onClick={this.onLogout}>
                  <span>Log Out</span>
                  {' '}
                </Menu.Item>
              </Menu>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Container className="main">


        {children}
      </Container>
    </div> : <LoginForm login={this.onLogin} />;
  }
}

const mapStateToProps = ({ security: securityState }: StateType, ownProps: PropsType) => ({
  isAuthenticated: securityState.isAuthenticated
});

const mapDispatchToProp = (dispatch: Function) => {
  return {
    securityActions: bindActionCreators(securityActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(CoreLayout);
/*
        <section className="body">
          <Grid>
            <Grid.Column width={16}>
              <Segment>
                  <CampaignsNavContainer selectedCampaign={parseInt(routeParams.campaign, 10)} />
              </Segment>
            </Grid.Column>
          </Grid>
        </section>*/