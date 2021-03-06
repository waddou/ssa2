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

import { OperatingSystem } from 'OperatingSystem';
import ConnectionSettings from 'ConnectionSettings';
import ModuleSettings from 'ModuleSettings';

/** Server status. */
export enum ServerStatus {
  None = 0,
  Loading = 1 << 0,
  Saving = 1 << 1,
  Deleting = 1 << 2,
  Connecting = 1 << 3,
  Testing = 1 << 4,
  Connected = 1 << 5,
  ConnectionError = 1 << 6
}

/**
 * Represents server info.
 */
export class Server {

  /** Config file name. */
  public FileName: string;

  /** Server name. */
  public Name: string;

  /** Server description. */
  public Description: string;

  /** Status. */
  public Disabled: boolean;

  /** List of modules on the server. Empty - all modules by default. */
  public Modules: Array<ModuleSettings>;

  /** Address to which the user will be redirected after logout. */
  public LogoutRedirect: string;

  /** Connection settings. */
  public Connection: ConnectionSettings;

  /** The operating system under which the server is running. */
  public OS: OperatingSystem;

  /** Connection status. Is not for WebAPI. */
  public Status: ServerStatus;

  /** Connection status message. Is not for WebAPI. */
  public StatusMessage: string;

}