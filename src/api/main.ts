import { invoke } from '@tauri-apps/api/tauri';

/*
 * 连接grpc，可以多次调用，不会出现内存泄漏问题
 */
export async function conn_grpc_server(addr: string): Promise<boolean> {
  return invoke<boolean>('conn_grpc_server', { addr: addr });
}

//检查是否连接上服务器
export async function is_conn_server(): Promise<boolean> {
  return invoke<boolean>('is_conn_server', {});
}

//检查更新
export async function check_update(): Promise<void> {
  return invoke<void>("check_update", {});
}