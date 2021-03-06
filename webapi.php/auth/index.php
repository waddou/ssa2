<?php
namespace WebAPI\Auth;

/*
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

use \WebAPI\Core\ApiException as ApiException;
use \WebAPI\Core\ApiErrorCode as ApiErrorCode;

/**
 * Processing user authentication requests.
 */
class Index extends \WebAPI\Core\Module implements \WebAPI\Core\IModuleFlags
{

  public function GetToken($username, $password)
  {
    if (!isset($username) || $username == '')
    {
      throw new ApiException('Username is required. Value cannot be empty.', ApiErrorCode::ARGUMENT_NULL_OR_EMPY);
    }

    if (!isset($password) || $password == '')
    {
      throw new ApiException('Password is required. Value cannot be empty.', ApiErrorCode::ARGUMENT_NULL_OR_EMPY);
    }

    // TODO
    return ['TokenValue' => 42];
  }

  public function TokenIsValid($token)
  {
    if (!isset($token) || $token == '')
    {
      throw new ApiException('Token is required. Value cannot be empty.', ApiErrorCode::ARGUMENT_NULL_OR_EMPY);
    }

    // TODO
    return ['Success' => TRUE];
  }


  #region WebAPI\Core\IModule Members

  /**
   * Returns flags of the module.
   *
   * @return int
   */
  function GetModuleFlags()
  {
    return \WebAPI\Core\ModuleFlags::ANONYMOUS | \WebAPI\Core\ModuleFlags::WITHOUT_SERVER;
  }

  #endregion
}