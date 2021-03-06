/*
* Mbed Cloud JavaScript SDK
* Copyright Arm Limited 2017
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

import { ConnectionOptions } from "../common/interfaces";
import { EndpointsBase } from "../common/endpointsBase";
import {
    AccountAdminApi as AdminApi,
    DeveloperApi as AccountDeveloperApi
} from "../_api/iam";
import {
    ServerCredentialsApi as ServerApi,
    DeveloperCertificateApi as CertDeveloperApi
} from "../_api/connector_ca";

export class Endpoints extends EndpointsBase {

    public certDeveloper: CertDeveloperApi;
    public accountDeveloper: AccountDeveloperApi;
    public server: ServerApi;
    public admin: AdminApi;

    constructor(options: ConnectionOptions) {
        super();
        this.certDeveloper = new CertDeveloperApi(options.apiKey, options.host, this.responseHandler.bind(this));
        this.accountDeveloper = new AccountDeveloperApi(options.apiKey, options.host, this.responseHandler.bind(this));
        this.server = new ServerApi(options.apiKey, options.host, this.responseHandler.bind(this));
        this.admin = new AdminApi(options.apiKey, options.host, this.responseHandler.bind(this));
    }
}
