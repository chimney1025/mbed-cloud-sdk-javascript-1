import { ListOptions, ComparisonObject } from "../common/interfaces";
export declare type AccountStatusEnum = "ENROLLING" | "ACTIVE" | "RESTRICTED" | "SUSPENDED";
/**
 * This object represents an account in requests and responses.
 */
export interface UpdateAccountObject {
    /**
     * The display name for the account.
     */
    displayName?: string;
    /**
     * An array of aliases.
     */
    aliases?: string[];
    /**
     * The name of the company.
     */
    company?: string;
    /**
     * The name of the contact person for this account.
     */
    contact?: string;
    /**
     * The company email address for this account.
     */
    email?: string;
    /**
     * The phone number of the company.
     */
    phoneNumber?: string;
    /**
     * Postal address line 1.
     */
    addressLine1?: string;
    /**
     * Postal address line 2.
     */
    addressLine2?: string;
    /**
     * The city part of the postal address.
     */
    city?: string;
    /**
     * The state part of the postal address.
     */
    state?: string;
    /**
     * The postal code part of the postal address.
     */
    postcode?: string;
    /**
     * The country part of the postal address.
     */
    country?: string;
}
export declare type ApiKeyStatusEnum = "ACTIVE" | "INACTIVE";
/**
 * This object represents an API key in mbed Cloud.
 */
export interface AddApiKeyObject {
    /**
     * The display name for the API key.
     */
    name: string;
    /**
     * The owner of this API key, who is the creator by default.
     */
    ownerId?: string;
}
export interface UpdateApiKeyObject extends AddApiKeyObject {
    /**
     * The UUID of the API key.
     */
    id: string;
}
export declare type UserStatusEnum = "ENROLLING" | "INVITED" | "ACTIVE" | "RESET" | "INACTIVE";
/**
 * This object represents a user in mbed Cloud.
 */
export interface AddUserObject {
    /**
     * The full name of the user.
     */
    fullName?: string;
    /**
     * A username containing alphanumerical letters and -,._@+= characters.
     */
    username?: string;
    /**
     * The password when creating a new user. It will will generated when not present in the request.
     */
    password?: string;
    /**
     * The email address.
     */
    email: string;
    /**
     * Phone number.
     */
    phoneNumber?: string;
    /**
     * Address.
     */
    address?: string;
    /**
     * A flag indicating that the General Terms and Conditions has been accepted.
     */
    termsAccepted?: boolean;
    /**
     * A flag indicating that receiving marketing information has been accepted.
     */
    marketingAccepted?: boolean;
}
export interface UpdateUserObject extends AddUserObject {
    /**
     * The UUID of the user.
     */
    id: string;
}
/**
 * Options to use when listing api keys
 */
export interface ApiKeyListOptions extends ListOptions {
    /**
     * The api key filter
     *
     * Constructed like so:
     *  ```JavaScript
     *  filter: {
     *    ownerId: { $eq: "1234" }
     *  }
     *  ```
     */
    filter?: {
        /**
         * Owner filter
         */
        ownerId: ComparisonObject<string>;
    };
}
/**
 * Options to use when listing users
 */
export interface UserListOptions extends ListOptions {
    /**
     * The user filter
     *
     * Constructed like so:
     *  ```JavaScript
     *  filter: {
     *    status: { $eq: "INVITED" }
     *  }
     *  ```
     */
    filter?: {
        /**
         * User status filter
         */
        status: ComparisonObject<UserStatusEnum>;
    };
}