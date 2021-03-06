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

import ApiError from 'API/ApiError';

/**
 * Defines properties that can be used when making a request to the API.
 */
export interface IMakeRequestProps<TRequest, TResponse> {

  /** The method that should be called in the WebAPI. For example: Control.GetServers */
  Method: string;

  /** Request parameters. */
  Data?: TRequest;

  /** Server name. Default: ManagedServerName. */
  Server?: string;

  /** API endpoint. */
  Url?: string;

  /** Handler for successful response. */
  SuccessCallback?: { (result: TResponse): void; };

  /**
   * The error handler.
   * When defining a custom handler, the default handler will not be called.
   */
  ErrorCallback?: { (error: ApiError): void; };

  /** Handler for completion of the request. */
  CompleteCallback?: { (): void; };

  DisableDefaultErrorHandler?: boolean;

}

export default IMakeRequestProps;