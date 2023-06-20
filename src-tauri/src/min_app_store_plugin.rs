use crypto::buffer::{BufferResult, ReadBuffer, WriteBuffer};
use crypto::{aes, blockmodes, buffer};
use rand::{thread_rng, Rng};
use std::collections::HashMap;
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

use crate::user_api_plugin::get_user_secret;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct StoreStatus {
    total_size: u64,
    key_count: usize,
}

#[derive(Default)]
pub struct StoreMap(pub Mutex<HashMap<String, sled::Db>>);

fn open_db(label: String) -> Result<sled::Db, String> {
    let path = crate::get_minapp_dir();
    if path.is_none() {
        return Err("no minapp store dir".into());
    }
    let path = path.unwrap();
    let mut path = std::path::PathBuf::from(&path);
    let min_app_id = label.replace("minApp:", "");
    path.push(min_app_id);
    let path = path.to_str().unwrap();
    let db = sled::open(&path);
    if db.is_err() {
        return Err(db.err().unwrap().to_string());
    }
    let db = db.unwrap();
    return Ok(db);
}

pub async fn start_store<R: Runtime>(
    app_handle: AppHandle<R>,
    label: String,
) -> Result<(), String> {
    let db = open_db(label.clone());
    if db.is_err() {
        return Err(db.err().unwrap());
    }

    let store_map = app_handle.state::<StoreMap>().inner();
    let mut store_map_data = store_map.0.lock().await;
    store_map_data.insert(label, db.unwrap());
    return Ok(());
}

pub async fn close_store<R: Runtime>(app_handle: AppHandle<R>, label: &String) {
    let store_map = app_handle.state::<StoreMap>().inner();
    let mut store_map_data = store_map.0.lock().await;
    let db = store_map_data.remove(label);
    if db.is_some() {
        let db = db.unwrap();
        let _ = db.flush();
        println!("close minapp store");
    }
}

async fn encrypt<R: Runtime>(app_handle: AppHandle<R>, data: Vec<u8>) -> Result<Vec<u8>, String> {
    let secret = get_user_secret(app_handle).await;
    if &secret == "" {
        return Err("miss secret".into());
    }
    let mut iv: [u8; 16] = [0; 16];
    let mut rng = thread_rng();
    let res = rng.try_fill(&mut iv);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let mut final_result: Vec<u8> = Vec::from(iv);

    let mut encryptor = aes::cbc_encryptor(
        aes::KeySize::KeySize256,
        secret.as_bytes(),
        &iv,
        blockmodes::PkcsPadding,
    );
    let mut read_buffer = buffer::RefReadBuffer::new(&data);
    let mut buffer = [0; 4096];
    let mut write_buffer = buffer::RefWriteBuffer::new(&mut buffer);

    loop {
        let result = encryptor.encrypt(&mut read_buffer, &mut write_buffer, true);
        if result.is_err() {
            return Err("encrypt error".into());
        }
        let result = result.unwrap();
        final_result.extend(
            write_buffer
                .take_read_buffer()
                .take_remaining()
                .iter()
                .map(|&i| i),
        );

        match result {
            BufferResult::BufferUnderflow => break,
            BufferResult::BufferOverflow => {}
        }
    }
    return Ok(final_result);
}

async fn decrypt<R: Runtime>(app_handle: AppHandle<R>, data: Vec<u8>) -> Result<Vec<u8>, String> {
    let secret = get_user_secret(app_handle).await;
    if &secret == "" {
        return Err("miss secret".into());
    }
    if data.len() < 16 {
        return Err("miss iv".into());
    }
    let (iv, data) = data.split_at(16);
    let mut decryptor = aes::cbc_decryptor(
        aes::KeySize::KeySize256,
        secret.as_bytes(),
        iv,
        blockmodes::PkcsPadding,
    );
    let mut final_result = Vec::<u8>::new();
    let mut read_buffer = buffer::RefReadBuffer::new(data);
    let mut buffer = [0; 4096];
    let mut write_buffer = buffer::RefWriteBuffer::new(&mut buffer);

    loop {
        let result = decryptor.decrypt(&mut read_buffer, &mut write_buffer, true);
        if result.is_err() {
            return Err("decrypt error".into());
        }
        let result = result.unwrap();
        final_result.extend(
            write_buffer
                .take_read_buffer()
                .take_remaining()
                .iter()
                .map(|&i| i),
        );
        match result {
            BufferResult::BufferUnderflow => break,
            BufferResult::BufferOverflow => {}
        }
    }

    return Ok(final_result);
}

#[tauri::command]
pub async fn set_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    key: Vec<u8>,
    value: Vec<u8>,
) -> Result<(), String> {
    let label = window.label();
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(label) {
        let value = encrypt(app_handle.clone(), value).await;
        if value.is_err() {
            return Err(value.err().unwrap());
        }
        let value = value.unwrap();
        let res = db.insert(key, value);
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    }

    return Ok(());
}

#[tauri::command]
pub async fn get_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    key: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let label = window.label();
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(label) {
        let res = db.get(key);
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
        let res = res.unwrap();
        if res.is_none() {
            return Err("no data".into());
        }
        let res = res.unwrap();
        let value = res.to_vec();
        return decrypt(app_handle.clone(), value).await;
    }
    return Err("no data".into());
}

#[tauri::command]
pub async fn remove_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    key: Vec<u8>,
) -> Result<(), String> {
    let label = window.label();
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(label) {
        let res = db.remove(key);
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    }
    return Ok(());
}

#[tauri::command]
pub async fn list_all<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
) -> Result<Vec<(Vec<u8>, Vec<u8>)>, String> {
    let label = window.label();
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(label) {
        let mut ret_list: Vec<(Vec<u8>, Vec<u8>)> = Vec::new();
        for res in db.iter() {
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
            let (key, value) = res.unwrap();
            let key = key.to_vec();

            let value = value.to_vec();
            let value = decrypt(app_handle.clone(), value).await;
            if value.is_err() {
                return Err(value.err().unwrap());
            }
            let value = value.unwrap();
            ret_list.push((key, value));
        }
        return Ok(ret_list);
    }
    return Err("no data".into());
}

#[tauri::command]
pub async fn clear_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    label: String,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("not allow".into());
    }
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(&label) {
        let res = db.clear();
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
        let _ = db.flush();
    } else {
        let db = open_db(label.clone());
        if db.is_err() {
            return Err(db.err().unwrap());
        }
        let db = db.unwrap();
        let res = db.clear();
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
        let _ = db.flush();
    }
    return Ok(());
}

#[tauri::command]
pub async fn get_status<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    label: String,
) -> Result<StoreStatus, String> {
    if window.label() != "main" {
        return Err("not allow".into());
    }
    let db_map = app_handle.state::<StoreMap>().inner();
    let mut db_map = db_map.0.lock().await;
    if let Some(db) = db_map.get_mut(&label) {
        let size_res = db.size_on_disk();
        if size_res.is_err() {
            return Err(size_res.err().unwrap().to_string());
        }
        let count = db.len();
        return Ok(StoreStatus {
            total_size: size_res.unwrap(),
            key_count: count,
        });
    } else {
        let db = open_db(label.clone());
        if db.is_err() {
            return Err(db.err().unwrap());
        }
        let db = db.unwrap();
        let size_res = db.size_on_disk();
        if size_res.is_err() {
            return Err(size_res.err().unwrap().to_string());
        }
        let count = db.len();
        return Ok(StoreStatus {
            total_size: size_res.unwrap(),
            key_count: count,
        });
    }
}

pub struct MinAppStorePlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> MinAppStorePlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                set_data,
                get_data,
                remove_data,
                list_all,
                clear_data,
                get_status,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for MinAppStorePlugin<R> {
    fn name(&self) -> &'static str {
        "min_app_store"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(StoreMap(Default::default()));
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
