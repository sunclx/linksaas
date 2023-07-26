export interface MethodInfo {
    methodName: string;
    clientStream: boolean;
    serverStream: boolean;
}

export interface ServiceInfo {
    serviceName: string;
    methodList: MethodInfo[];
}

export interface MethodWithServiceInfo {
    serviceName: string;
    method: MethodInfo;
}