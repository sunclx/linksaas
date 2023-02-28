use image::codecs::bmp::BmpEncoder;
use image::codecs::png::PngEncoder;
use image::imageops::resize;
use image::io::Reader as ImageReader;
use image::{ColorType, EncodableLayout, ImageEncoder, RgbaImage};
use std::vec::Vec;

pub fn encode_to_bmp(img: RgbaImage) -> Result<Vec<u8>, String> {
    let mut ret_data: Vec<u8> = Vec::new();
    let (w, h) = (&img).dimensions();
    let encoder = BmpEncoder::new(&mut ret_data);
    if let Ok(_) = encoder.write_image(img.as_bytes(), w, h, ColorType::Rgba8) {
        return Ok(ret_data);
    }
    return Err("encode failed".into());
}

pub fn encode_to_png(img: RgbaImage) -> Result<Vec<u8>, String> {
    let mut ret_data: Vec<u8> = Vec::new();
    let (w, h) = (&img).dimensions();
    let encoder = PngEncoder::new(&mut ret_data);
    if let Ok(_) = encoder.write_image(img.as_bytes(), w, h, ColorType::Rgba8) {
        return Ok(ret_data);
    }
    return Err("encode failed".into());
}

pub fn read_image(file_path: String) -> Result<RgbaImage, String> {
    let open_res = ImageReader::open(file_path);
    if open_res.is_err() {
        return Err(open_res.err().unwrap().to_string());
    }
    let decode_res = open_res.unwrap().decode();
    if decode_res.is_err() {
        return Err(decode_res.err().unwrap().to_string());
    }
    return Ok(decode_res.unwrap().to_rgba8());
}

pub fn resize_image(img: RgbaImage, width: u32, height: u32) -> RgbaImage {
    return resize(&img, width, height, image::imageops::FilterType::Nearest);
}
