import { CallbackFn } from "../../common/interfaces";
import { AddDeviceObject } from "../types";
import { DeviceDirectoryApi } from "../deviceDirectoryApi";
/**
 * Device
 */
export declare class Device {
    private _api;
    /**
     * The ID of the device
     */
    readonly id: string;
    /**
     * The owning IAM account ID
     */
    readonly accountId?: string;
    /**
     * The time the device was created
     */
    readonly createdAt?: Date;
    /**
     * The time the device was updated
     */
    readonly updatedAt?: Date;
    /**
     * The timestamp of the current manifest version
     */
    readonly manifestTimestamp?: Date;
    constructor(init?: Partial<Device>, _api?: DeviceDirectoryApi);
    /**
     * Update the device
     * @returns Promise of device
     */
    update(): Promise<Device>;
    /**
     * Update the device
     * @param callback A function that is passed the arguments (error, device)
     */
    update(callback: CallbackFn<Device>): void;
    /**
     * Deletes a device
     * @returns Promise containing any error
     */
    delete(): Promise<void>;
    /**
     * Deletes a device
     * @param callback A function that is passed any error
     */
    delete(callback: CallbackFn<void>): void;
}
export interface Device extends AddDeviceObject {
}