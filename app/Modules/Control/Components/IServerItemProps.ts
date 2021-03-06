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

import { Server } from 'Models/Server';
import { OutputMode } from 'OutputMode';

export interface IServerItemProps {

  Server: Server;

  OutputMode: OutputMode;

  Disabled: boolean;

  ShowControl: boolean;

  OnConnect: { (server: Server): void; };

  OnEdit: { (server: Server): void; };

  OnDelete: { (server: Server): void; };

}

export default IServerItemProps;