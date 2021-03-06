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
import App from 'Core/App';
import { OverlayType } from 'OverlayType';

import { connect } from 'react-redux';

/**
 * Represent overlay.
 */
export class Overlay extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
    Debug.Init(this);
  }

  private GetClassName(): string {
    let result = 'overlay-wrapper';

    let overlayType = App.Overlay.OverlayType;

    if (overlayType & OverlayType.Opacity15) {
      result += ' overlay-opacity15';
    }
    else if (overlayType & OverlayType.Opacity25) {
      result += ' overlay-opacity25';
    }
    else if (overlayType & OverlayType.Opacity50) {
      result += ' overlay-opacity50';
    }
    else if (overlayType & OverlayType.Opacity75) {
      result += ' overlay-opacity75';
    }
    else if (overlayType & OverlayType.Opacity90) {
      result += ' overlay-opacity90';
    }

    return result;
  }

  private GetLoadingIndicator(): JSX.Element {
    let overlayType = App.Overlay.OverlayType;

    if ((overlayType & OverlayType.Loader) != OverlayType.Loader) {
      return null;
    }

    // type
    let className = 'loader';

    if (overlayType & OverlayType.TextGreen) {
      className += ' loader-green';
    }
    else if (overlayType & OverlayType.TextRed) {
      className += ' loader-red';
    }
    else if (overlayType & OverlayType.TextGreen) {
      className += ' loader-green';
    }
    else if (overlayType & OverlayType.TextWhite) {
      className += ' loader-white';
    }

    // text
    let text = null;

    if (App.Overlay.Text != null && App.Overlay.Text != '') {
      text = (<div className="loader-text">{ App.Overlay.Text }</div>);
    }

    return (
      <div className={ className }>
        <i className="fa fa-spinner fa-pulse fa-fw"></i>
        {text}
      </div>
    );
  }

  render() {
    Debug.Render('Overlay', App.Overlay.OverlayType, App.Overlay.Text);

    if (App.Overlay.OverlayType == OverlayType.Invisible) {
      return null;
    } else {
      return (
        <div className={  this.GetClassName() }>
          { this.GetLoadingIndicator() }
        </div>
      );
    }
  }
  
}

export default connect(state => ({
  Overlay: state.Overlay
}))(Overlay);