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
import IMainContext from 'IMainContext';
import App from 'App';
import { SetBreadcrumbs } from 'Actions/Global';

/**
 * The base class for pages.
 */
export default class Page<P, S> extends React.Component<P, S> {

  static defaultProps = {
    Title: 'SmallServerAdminV2'
  }

  context: IMainContext;

  // registration of the context type, already defined into the containing component
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired
  }

  constructor(props?, context?) {
    super(props, context);
    
    Debug.Init2('Page', (this.props as any).Title, this);
  }

  componentWillMount() {
    this.SetBreadcrumbs('Dashboard');
  }

  public SetBreadcrumbs(breadcrumbs: string): void {
    App.Store.dispatch(SetBreadcrumbs(breadcrumbs));
  }

}