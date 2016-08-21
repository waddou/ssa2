﻿/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro (aleksey.nemiro.ru), 2016. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import { Link } from 'react-router';
import App from 'Core/App';
import Component from 'Core/Component';
import { Server, ServerStatus } from 'Models/Server';
import ProcessingIndicator from 'UI/ProcessingIndicator';
import IServersListState from 'IServersListState';
import IServersListProps from 'IServersListProps';
import ServerItem from 'ServerItem';
import { OutputMode } from 'OutputMode';

import {
  Table,
  Button,
  Row,
  Col
} from 'react-bootstrap';

/**
 * Represents a list of servers to manage.
 */
export default class ServersList extends Component<IServersListProps, IServersListState> {

  constructor(props, context) {
    super(props, context);

    this.state = {
      Servers: new Array<Server>(),
      Loading: true,
      Testing: false,
      OutputMode: this.props.OutputMode || OutputMode.List,
    };
  }

  componentWillMount() {
    Debug.Call3('ServersList.componentWillMount');

    this.LoadServers();
  }

  componentDidMount() {
    Debug.Call3('ServersList.componentDidMount');

    if (this.props.OutputMode != OutputMode.Thumbnail && this.props.OutputMode != OutputMode.ThumbnailLarge) {
      return;
    }

    // height correction
    // TODO: find the best solution

    let maxHeight = 0;

    $('.server-item-wrapper').each((index, element) => {
      if ($(element).height() > maxHeight) { maxHeight = $(element).height(); }
    });

    $('.server-item-wrapper').height(maxHeight);
  }

  componentWillReceiveProps(nextProps: IServersListProps) {
    Debug.Call3('ServersList.componentWillReceiveProps', nextProps);

    if (nextProps.OutputMode != this.state.OutputMode) {
      this.setState({ OutputMode: nextProps.OutputMode });
    }
  }

  /**
   * Loads list of servers.
   */
  private LoadServers(): void {
    App.MakeRequest<any, Array<Server>>({
      Method: 'Control.GetServers',
      SuccessCallback: (result) => {
        this.setState({ Servers: result, Loading: false });

        this.TestCurrentServerConnection();
      }
    });
  }

  private ConnectToServer(server: Server): void {
    Debug.Call3('ConnectToServer', server);

    server.Status = ServerStatus.Connecting;
    
    this.setState({ Testing: true }, () => {
      this.TestConnection(server, true);
    });
  }

  private TestConnection(server: Server, setServer: boolean): void {
    Debug.Call3('TestConnection', server);

    App.MakeRequest({
      Method: 'Control.ConnectionTest',
      Server: server.FileName,
      SuccessCallback: (result) => {
        Debug.Level3('TestConnection.Success', server);

        // set status to tested server
        server.Status = ServerStatus.Connected; // TODO: Tested
        server.StatusMessage = null;

        if (setServer) {
          // reset status of all servers
          this.state.Servers.forEach((s) => {
            if (s.FileName != server.FileName && (s.Status & ServerStatus.Connected)) {
              s.Status = ServerStatus.None;
            }
          });

          // set tested server as current server
          App.CurrentUser.SetManagedServer(server);
        }
      },
      ErrorCallback: (error) => {
        Debug.Level3('TestConnection.Error', server);
        server.Status = ServerStatus.ConnectionError;
        server.StatusMessage = error.Text || error.Code;
      },
      CompleteCallback: () => {
        this.setState({ Testing: false });
      }
    });
  }

  private TestCurrentServerConnection(): void {
    if (App.CurrentUser.ManagedServer == null) {
      return;
    }

    let currentServerName = App.CurrentUser.ManagedServerName;

    for (let i = 0; i < this.state.Servers.length; i++) {
      if (this.state.Servers[i].FileName == currentServerName) {
        this.state.Servers[i].Status = ServerStatus.Testing;

        this.setState({ Testing: true }, () => {
          this.TestConnection(this.state.Servers[i], false);
        });

        break;
      }
    }
  }

  private SetStatusToCurrentServer(newStatus: ServerStatus): void {
    if (App.CurrentUser.ManagedServer == null) {
      return;
    }

    let currentServerName = App.CurrentUser.ManagedServerName;

    for (let i = 0; i < this.state.Servers.length; i++) {
      if (this.state.Servers[i].FileName == currentServerName) {
        this.state.Servers[i].Status = newStatus;
        break;
      }
    }
  }

  render() {
    Debug.Render2('ServersList', this.state.Loading);

    if (this.state.Loading) {
      return (<ProcessingIndicator Text={ __('Loading. Please wait...') } />);
    }

    let list = [];

    let currentServer = App.CurrentUser.ManagedServerName;

    this.state.Servers.forEach((server, index) => {
      list.push(
        <ServerItem
          Server={server}
          OutputMode={ this.state.OutputMode }
          key={'server-' + index}
          OnConnect={ this.ConnectToServer.bind(this) }
          Disabled={ this.state.Testing }
          ShowControl={ this.props.ShowControl }
        />
      );
    });

    let servers = null;

    if (this.state.OutputMode == OutputMode.List) {
      // list
      servers = (
        <Table hover className="cell-align-middle">
          <tbody>{list}</tbody>
        </Table>
      );
    } else {
      // thumbs
      servers = (<Row>{list}</Row>);
    }

    return (
      <div>
        {servers}
      </div>
    );
  }

}