/* 
* mbed Cloud JavaScript SDK
* Copyright ARM Limited 2017
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

import { apiWrapper, mapListResponse, encodeInclude } from "../common/functions";
import { ConnectionOptions, CallbackFn, ListOptions, ListResponse } from "../common/interfaces";
import { Endpoints } from "./endpoints";
import { UpdateAccountObject, AddApiKeyObject, UpdateApiKeyObject, AddUserObject, UpdateUserObject, ApiKeyListOptions, UserListOptions } from "./types";
import { Account } from "./models/account";
import { AccountAdapter } from "./models/accountAdapter"
import { ApiKey } from "./models/apiKey";
import { ApiKeyAdapter } from "./models/apiKeyAdapter";
import { User } from "./models/user";
import { UserAdapter } from "./models/userAdapter";
import { Group } from "./models/group";
import { GroupAdapter } from "./models/groupAdapter";

/**
 * ## Account Management API
 *
 * This API is initialized with [ConnectionOptions](../interfaces/connectionoptions.html).
 *
 * To create an instance of this API in [Node.js](https://nodejs.org):
 *
 * ```JavaScript
 * var mbedCloudSDK = require("mbed-cloud-sdk");
 *
 * var accounts = new mbedCloudSDK.AccountManagementApi({
 *     apiKey: "<mbed Cloud API Key>"
 * });
 * ```
 *
 * To create an instance of this API in the browser:
 *
 * ```html
 * <script src="<mbed-cloud-sdk>/bundles/account-management.min.js"></script>
 *
 * <script>
 *     var accounts = new mbedCloudSDK.AccountManagementApi({
 *         apiKey: "<mbed Cloud API Key>"
 *     });
 * </script>
 * ```
 */
export class AccountManagementApi {

    private _endpoints: Endpoints;

    /**
    * @param options connection options
    */
    constructor(options: ConnectionOptions) {
        this._endpoints = new Endpoints(options);
    }

    /**
     * Get details of account associated with current API key
     * @returns Promise of account
     */
    public getAccount(): Promise<Account>;
    /**
     * Get details of account associated with current API key
     * @param callback A function that is passed the return arguments (error, account)
     */
    public getAccount(callback: CallbackFn<Account>): void;
    public getAccount(callback?: CallbackFn<Account>): Promise<Account> {
        return apiWrapper(resultsFn => {
            this._endpoints.developer.getMyAccountInfo("limits, policies", resultsFn);
        }, (data, done) => {
            done(null, AccountAdapter.map(data, this));
        }, callback);
    }

    /**
     * Update details of account associated with current API key
     * @param account The account object to update
     * @returns Promise of account
     */
    public updateAccount(account: UpdateAccountObject): Promise<Account>;
    /**
     * Update details of account associated with current API key
     * @param account The account object to update
     * @param callback A function that is passed the return arguments (error, account)
     */
    public updateAccount(account: UpdateAccountObject, callback?: CallbackFn<Account>): void;
    public updateAccount(account: UpdateAccountObject, callback?: CallbackFn<Account>): Promise<Account> {
        return apiWrapper(resultsFn => {
            this._endpoints.admin.updateMyAccount(AccountAdapter.reverseMap(account), resultsFn);
        }, (data, done) => {
            done(null, AccountAdapter.map(data, this));
        }, callback);
    }

    /**
     * List API keys
     * @param options filter options
     * @returns Promise of listResponse
     */
    public listApiKeys(options?: ApiKeyListOptions): Promise<ListResponse<ApiKey>>;
    /**
     * List API keys
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    public listApiKeys(options?: ApiKeyListOptions, callback?: CallbackFn<ListResponse<ApiKey>>): void;
    public listApiKeys(options?: any, callback?: CallbackFn<ListResponse<ApiKey>>): Promise<ListResponse<ApiKey>> {
        options = options || {};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        return apiWrapper(resultsFn => {
            let { limit, after, order, include, owner } = options as ApiKeyListOptions;
            this._endpoints.developer.getAllApiKeys(limit, after, order, encodeInclude(include), owner, resultsFn);
        }, (data, done) => {
            let keys: ApiKey[];
            if (data && data.data && data.data.length) {
                keys = data.data.map(key => {
                    return ApiKeyAdapter.map(key, this);
                });
            }

            done(null, mapListResponse(data, keys));
        }, callback);
    }

    /**
     * Get details of an API key
     * @param apiKeyId The API key ID (if not specified, returns current API key)
     * @returns Promise containing the API key
     */
    public getApiKey(apiKeyId?: string): Promise<ApiKey>;
    /**
     * Get details of an API key
     * @param apiKeyId The API key ID (if not specified, returns current API key)
     * @param callback A function that is passed the return arguments (error, API key)
     */
    public getApiKey(apiKeyId?: string, callback?: CallbackFn<ApiKey>): void;
    public getApiKey(apiKeyId?: any, callback?: CallbackFn<ApiKey>): Promise<ApiKey> {
        if (typeof apiKeyId === "function") {
            callback = apiKeyId;
            apiKeyId = null;
        }

        return apiWrapper(resultsFn => {
            if (apiKeyId) this._endpoints.developer.getApiKey(apiKeyId, resultsFn);
            else this._endpoints.developer.getMyApiKey(resultsFn);
        }, (data, done) => {
            done(null, ApiKeyAdapter.map(data, this));
        }, callback);
    }

    /**
     * Adds an API key
     * @param apiKey The API key to add
     * @returns Promise containing API key
     */
    public addApiKey(apiKey: AddApiKeyObject): Promise<ApiKey>;
    /**
     * Adds an API key
     * @param apiKey The API key to add
     * @param callback A function that is passed the return arguments (error, API key)
     */
    public addApiKey(apiKey: AddApiKeyObject, callback: CallbackFn<ApiKey>): void;
    public addApiKey(apiKey: AddApiKeyObject, callback?: CallbackFn<ApiKey>): Promise<ApiKey> {
        return apiWrapper(resultsFn => {
            this._endpoints.developer.createApiKey(ApiKeyAdapter.addMap(apiKey), resultsFn);
        }, (data, done) => {
            done(null, ApiKeyAdapter.map(data, this));
        }, callback);
    }

    /**
     * Updates an API key
     * @param apiKey The API key to add
     * @returns Promise containing API key
     */
    public updateApiKey(apiKey: UpdateApiKeyObject): Promise<ApiKey>;
    /**
     * Updates an API key
     * @param apiKey The API key to add
     * @param callback A function that is passed the return arguments (error, API key)
     */
    public updateApiKey(apiKey: UpdateApiKeyObject, callback: CallbackFn<ApiKey>): void;
    public updateApiKey(apiKey: UpdateApiKeyObject, callback?: CallbackFn<ApiKey>): Promise<ApiKey> {
        return apiWrapper(resultsFn => {
            this._endpoints.developer.updateApiKey(apiKey.id, ApiKeyAdapter.updateMap(apiKey), resultsFn);
        }, (data, done) => {
            done(null, ApiKeyAdapter.map(data, this));
        }, callback);
    }

    /**
     * Deletes an API key
     * @param apiKeyId The API key ID
     * @returns Promise containing any error
     */
    public deleteApiKey(apiKeyId: string): Promise<void>;
    /**
     * Deletes an API key
     * @param apiKeyId The API key ID
     * @param callback A function that is passed the return arguments (error, void)
     */
    public deleteApiKey(apiKeyId: string, callback: CallbackFn<void>): void;
    public deleteApiKey(apiKeyId: string, callback?: CallbackFn<void>): Promise<void> {
        return apiWrapper(resultsFn => {
            this._endpoints.developer.deleteApiKey(apiKeyId, resultsFn);
        }, (data, done) => {
            done(null, data);
        }, callback);
    }

    /**
     * List users
     * @param options filter options
     * @returns Promise of listResponse
     */
    public listUsers(options?: UserListOptions): Promise<ListResponse<User>>;
    /**
     * List users
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    public listUsers(options?: UserListOptions, callback?: CallbackFn<ListResponse<User>>): void;
    public listUsers(options?: any, callback?: CallbackFn<ListResponse<User>>): Promise<ListResponse<User>> {
        options = options || {};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        return apiWrapper(resultsFn => {
            let { limit, after, order, include, status } = options as UserListOptions;
            this._endpoints.admin.getAllUsers(limit, after, order, encodeInclude(include), status, resultsFn);
        }, (data, done) => {
            let users: User[];
            if (data.data && data.data.length) {
                users = data.data.map(user => {
                    return UserAdapter.map(user, this);
                });
            }

            done(null, mapListResponse(data, users));
        }, callback);
    }

    /**
     * Get details of a user
     * @param userId The user ID
     * @returns Promise containing the user
     */
    public getUser(userId: string): Promise<User>;
    /**
     * Get details of a user
     * @param userId The user ID
     * @param callback A function that is passed the return arguments (error, user)
     */
    public getUser(userId: string, callback: CallbackFn<User>): void;
    public getUser(userId: string, callback?: CallbackFn<User>): Promise<User> {
        return apiWrapper(resultsFn => {
            this._endpoints.admin.getUser(userId, resultsFn);
        }, (data, done) => {
            done(null, UserAdapter.map(data, this));
        }, callback);
    }

    /**
     * Adds a user
     * @param user User to add
     * @returns Promise containing user
     */
    public addUser(user: AddUserObject): Promise<User>;
    /**
     * Adds a user
     * @param user User to add
     * @param callback A function that is passed the return arguments (error, user)
     */
    public addUser(user: AddUserObject, callback: CallbackFn<User>): void;
    public addUser(user: AddUserObject, callback?: CallbackFn<User>): Promise<User> {
        return apiWrapper(resultsFn => {
            this._endpoints.admin.createUser(UserAdapter.addMap(user), "create", resultsFn);
        }, (data, done) => {
            done(null, UserAdapter.map(data, this));
        }, callback);
    }

    /**
     * Updates a user
     * @param user User to update
     * @returns Promise containing user
     */
    public updateUser(user: UpdateUserObject): Promise<User>;
    /**
     * Updates a user
     * @param user User to update
     * @param callback A function that is passed the return arguments (error, user)
     */
    public updateUser(user: UpdateUserObject, callback: CallbackFn<User>): void;
    public updateUser(user: UpdateUserObject, callback?: CallbackFn<User>): Promise<User> {
        return apiWrapper(resultsFn => {
            this._endpoints.admin.updateUser(user.id, UserAdapter.updateMap(user), resultsFn);
        }, (data, done) => {
            done(null, UserAdapter.map(data, this));
        }, callback);
    }

    /**
     * Deletes a user
     * @param userId The user ID
     * @returns Promise containing any error
     */
    public deleteUser(userId: string): Promise<void>;
    /**
     * Deletes a user
     * @param userId The user ID
     * @param callback A function that is passed the return arguments (error, void)
     */
    public deleteUser(userId: string, callback: CallbackFn<void>): void;
    public deleteUser(userId: string, callback?: CallbackFn<void>): Promise<void> {
        return apiWrapper(resultsFn => {
            this._endpoints.admin.deleteUser(userId, resultsFn);
        }, (data, done) => {
            done(null, data);
        }, callback);
    }

    /**
     * List groups
     * @param options filter options
     * @returns Promise of listResponse
     */
    public listGroups(options?: ListOptions): Promise<ListResponse<Group>>;
    /**
     * List groups
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    public listGroups(options?: ListOptions, callback?: CallbackFn<ListResponse<Group>>): void;
    public listGroups(options?: any, callback?: CallbackFn<ListResponse<Group>>): Promise<ListResponse<Group>> {
        options = options || {};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        return apiWrapper(resultsFn => {
            let { limit, after, order, include } = options as ListOptions;
            this._endpoints.developer.getAllGroups(limit, after, order, encodeInclude(include), resultsFn);
        }, (data, done) => {
            let groups: Group[];
            if (data.data && data.data.length) {
                groups = data.data.map(group => {
                    return GroupAdapter.map(group, this);
                });
            }

            done(null, mapListResponse(data, groups));
        }, callback);
    }

    /**
     * Get details of a group
     * @param groupId The group ID
     * @returns Promise containing the group
     */
    public getGroup(groupId: string): Promise<Group>;
    /**
     * Get details of a group
     * @param groupId The group ID
     * @param callback A function that is passed the arguments (error, group)
     */
    public getGroup(groupId: string, callback: CallbackFn<Group>): void;
    public getGroup(groupId: string, callback?: CallbackFn<Group>): Promise<Group> {
        return apiWrapper(resultsFn => {
            this._endpoints.developer.getGroupSummary(groupId, resultsFn);
        }, (data, done) => {
            done(null, GroupAdapter.map(data, this));
        }, callback);
    }

    /**
     * List users of a group
     * @param groupId The group ID
     * @param options filter options
     * @returns Promise of listResponse
     */
    public listGroupUsers(groupId: string, options?: ListOptions): Promise<ListResponse<User>>;
    /**
     * List users of a group
     * @param groupId The group ID
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    public listGroupUsers(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<User>>): void;
    public listGroupUsers(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<User>>): Promise<ListResponse<User>> {
        options = options || {};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        return apiWrapper(resultsFn => {
            let { limit, after, order, include } = options as ListOptions;
            this._endpoints.admin.getUsersOfGroup(groupId, limit, after, order, encodeInclude(include), resultsFn);
        }, (data, done) => {
            let users: User[];
            if (data.data && data.data.length) {
                users = data.data.map(user => {
                    return UserAdapter.map(user, this);
                });
            }

            done(null, mapListResponse(data, users));
        }, callback);
    }

    /**
     * List API keys of a group
     * @param groupId The group ID
     * @param options filter options
     * @returns Promise of listResponse
     */
    public listGroupApiKeys(groupId: string, options?: ListOptions): Promise<ListResponse<ApiKey>>;
    /**
     * List API keys of a group
     * @param groupId The group ID
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    public listGroupApiKeys(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<ApiKey>>): void;
    public listGroupApiKeys(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<ApiKey>>): Promise<ListResponse<ApiKey>> {
        options = options || {};
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        return apiWrapper(resultsFn => {
            let { limit, after, order, include } = options as ListOptions;
            this._endpoints.developer.getApiKeysOfGroup(groupId, limit, after, order, encodeInclude(include), resultsFn);
        }, (data, done) => {
            let keys: ApiKey[];
            if (data.data && data.data.length) {
                keys = data.data.map(key => {
                    return ApiKeyAdapter.map(key, this);
                });
            }

            done(null, mapListResponse(data, keys));
        }, callback);
    }
}
