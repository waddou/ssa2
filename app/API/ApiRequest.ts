﻿/*
 * Copyright © AdminStock Team (www.adminstock.net), 2016. All rights reserved.
 * Copyright © Aleksey Nemiro, 2016. All rights reserved.
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

import ApiResponse from 'API/ApiResponse';
import ApiError from 'API/ApiError';
import { ApiMessageType } from 'API/Enums';

/**
 * Represents a request to the WebAPI of SmallServerAdmin.
 */
export default class ApiRequest<TRequest, TResponse> {

  private static ActiveRequests: Array<JQueryXHR> = new Array<JQueryXHR>();

  /** The handler successful execution of the request. */
  public SuccessCallback: { (result: TResponse): void; } = null;

  /** The error handler. */
  public ErrorCallback: { (error: ApiError): void; } = null;

  /** The request complete handler. */
  public CompleteCallback: { (): void; } = null;

  private _Url: string;

  /** The address to which to send the request. */
  public get Url(): string {
    return this._Url;
  }

  private _Server: string;

  /** The configuration file name of the server that is managed. */
  public get Server(): string {
    return this._Server;
  }

  private _Method: string;

  /** The API method name. */
  public get Method(): string {
    return this._Method;
  }

  private _Data: TRequest;

  /** The request parameters. */
  public get Data(): TRequest {
    return this._Data;
  }

  private _Key: string;

  /** Unique key of the request. */
  public get Key(): string {
    return this._Key;
  }

  /** Access token of the current user. */
  private Token: string;
  
  constructor(method: string, data: TRequest, url: string, accessToken: string, server?: string) {
    if (method === null || method == '') {
      throw new Error('Method is required. Value cannot be empty.');
    }

    if (url === undefined || url == null || url == '') {
      throw new Error('Requires API server address. Value cannot be empty.');
    }

    // xdebug for WebAPI.PHP
    if (process.env.NODE_ENV !== 'production') {
      if (url.indexOf('?') == -1) {
        url += '?';
      } else {
        url += '&';
      }

      url += 'XDEBUG_SESSION_START=1';
    }

    this._Url = url;
    this._Method = method;
    this._Data = data || null;
    this._Key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this._Server = server;
    this.Token = accessToken;
  }

  /**
   * Sends a request to the API.
   */
  public Execute(): void {
    let $this = this;

    Debug.Level3('Token', this.Token);
    Debug.Level3('Server', this.Server);

    let headers = null;

    if ($this.Token != null) {
      headers = {
        'Authorization': 'SSA-TOKEN ' + $this.Token
      };
    }

    let data = {};

    if ($this.Method != null && $this.Method != '') {
      data = $.extend(data, { Method: $this.Method });
    }

    if ($this.Data != null) {
      data = $.extend(data, { Data: $this.Data });
    }

    if ($this.Server != null && $this.Server != '') {
      data = $.extend(data, { Server: $this.Server });
    }

    // Debug.Request('ApiRequest.Execute', this.Key, this.Url, data);
    Debug.Request(this.Method, this.Key, data);

    let r = $.ajax({
      cache: false,
      crossDomain: true,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: $this.Url,
      data: JSON.stringify(data),

      headers: headers,

      // handler of request succeeds
      success: (result: ApiResponse<TResponse>) => {
        // Debug.Response('ApiRequest.Success', $this.Key, $this.Url, result);
        Debug.Response(this.Method + ' > Success', this.Key, result);

        // debug
        if (process.env.NODE_ENV !== 'production') {
          if (result.Messages != undefined && result.Messages != null) {
            result.Messages.forEach((m) => {
              if (m.Type == ApiMessageType.MSG_WARNINIG) {
                Debug.Warn(m.Text);
              }
              else if (m.Type == ApiMessageType.MSG_ERROR || m.Type == ApiMessageType.MSG_CRITICAL) {
                Debug.Error(m.Text);
              } else {
                Debug.Log(m.Text);
              }
            });
          }
        }

        if ($this.SuccessCallback != null) {
          $this.SuccessCallback(result.Data);
        }
      },

      // server returned error
      error: (x: JQueryXHR, textStatus: string, errorThrown: any) => {
        // Debug.Response('ApiRequest.Error', $this.Key, $this.Url, x, textStatus, errorThrown);
        Debug.Response(this.Method + ' > Error', this.Key, x, textStatus, errorThrown);

        if (textStatus == 'abort') {
          // skip
          return;
        }

        let error: ApiError;

        if (x.responseText !== undefined && x.responseText != null && x.responseText != '') {
          try {
            let errorResult = JSON.parse(x.responseText);

            if (errorResult.Data !== undefined && errorResult.Data.Error !== undefined) {
              error = new ApiError(errorResult.Data.Error.Text, errorResult.Data.Error.Code, errorResult.Data.Error.Trace);
            } else {
              error = new ApiError(x.responseText);
            }
          } catch (ex) {
            error = new ApiError(x.responseText);
          }
        } else {
          error = new ApiError(textStatus || errorThrown);
        }

        if ($this.ErrorCallback != null) {
          $this.ErrorCallback(error);
        }
      },

      complete: (x: JQueryXHR, textStatus: string) => {
        Debug.Level3('ApiRequest.Complete', $this.Key, $this.Url);

        let itemToRemove = ApiRequest.ActiveRequests.indexOf(r);

        if (itemToRemove != -1) {
          let removedItem = ApiRequest.ActiveRequests.splice(itemToRemove, 1);
          Debug.Level3('Removed', itemToRemove, removedItem, ApiRequest.ActiveRequests.length);
        } else {
          Debug.Level3('Item not found.', r, ApiRequest.ActiveRequests.length);
        }

        if ($this.CompleteCallback != null) {
          $this.CompleteCallback();
        }
      }
    });

    ApiRequest.ActiveRequests.push(r);
  }

  /**
   * Sends a request to the API.
   */
  public Fetch(): Promise<TResponse> {
    let $this = this;

    Debug.Level3('Token', this.Token);
    Debug.Level3('Server', this.Server);

    let headers = null;

    if ($this.Token != null) {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': 'SSA-TOKEN ' + $this.Token
      };
    } else {
      headers = {
        'Content-Type': 'application/json'
      };
    }

    let data = {};

    if ($this.Method != null && $this.Method != '') {
      data = $.extend(data, { Method: $this.Method });
    }

    if ($this.Data != null) {
      data = $.extend(data, { Data: $this.Data });
    }

    if ($this.Server != null && $this.Server != '') {
      data = $.extend(data, { Server: $this.Server });
    }

    Debug.Request('ApiRequest.Fetch', this.Key, this.Url, data);

    return new Promise<TResponse>((resolve, reject) => {

      fetch($this.Url, {
        cache: 'no-cache',
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      }).then((response) => {
        response.json<ApiResponse<TResponse>>().then((result) => {
          Debug.Response('ApiRequest.Success', $this.Key, $this.Url, result);

          // debug
          if (process.env.NODE_ENV !== 'production') {
            if (result.Messages != undefined && result.Messages != null) {
              result.Messages.forEach((m) => {
                if (m.Type == ApiMessageType.MSG_WARNINIG) {
                  Debug.Warn(m.Text);
                }
                else if (m.Type == ApiMessageType.MSG_ERROR || m.Type == ApiMessageType.MSG_CRITICAL) {
                  Debug.Error(m.Text);
                } else {
                  Debug.Log(m.Text);
                }
              });
            }
          }
          
          if ($this.SuccessCallback != null) {
            $this.SuccessCallback(result.Data);
          } else {
            resolve(result.Data);
          }
          
          if ($this.CompleteCallback != null) {
            $this.CompleteCallback();
          }
        }).catch((error) => {
          Debug.Response('ApiRequest.Error', error);
          
          if ($this.ErrorCallback != null) {
            $this.ErrorCallback(error);
          }
          
          if ($this.CompleteCallback != null) {
            $this.CompleteCallback();
          }
        });
      }).catch((error) => {
        Debug.Response('ApiRequest.Error', error);

        if ($this.ErrorCallback != null) {
          $this.ErrorCallback(error);
        }
        
        if ($this.CompleteCallback != null) {
          $this.CompleteCallback();
        }
      });
    });
  }

  public static AbortAll(): void {
    Debug.Call('ApiRequest.AbortAll', ApiRequest.ActiveRequests.length);

    ApiRequest.ActiveRequests.forEach((x) => {
      if (x.readyState == 1) {
        x.abort();
      }
    });
  }

}