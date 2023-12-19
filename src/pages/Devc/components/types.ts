export type ContainerInfo = {
    containerId: string;
    serverPort: number;
};

export type CommandResult = {
    success: boolean;
    data?: any;
    errMsg?: string;
}