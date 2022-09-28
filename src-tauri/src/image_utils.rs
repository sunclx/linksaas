use image::codecs::bmp::BmpEncoder;
use image::codecs::png::PngEncoder;
use image::imageops::resize;
use image::io::Reader as ImageReader;
use image::{ColorType, EncodableLayout, ImageBuffer, ImageEncoder, Rgba, RgbaImage};
use scrap::{Capturer, Display};
use std::thread;
use std::time::Duration;
use std::vec::Vec;

pub fn capture_screen_data(
    do_blur: bool,
    blur_sigma: f32,
) -> Result<Vec<ImageBuffer<Rgba<u8>, Vec<u8>>>, String> {
    let mut ret_list: Vec<ImageBuffer<Rgba<u8>, Vec<u8>>> = Vec::new();
    if let Ok(display_list) = Display::all() {
        for display in display_list {
            if let Ok(mut capturer) = Capturer::new(display) {
                let (w, h) = (capturer.width(), capturer.height());
                if w < h {
                    //windows上竖屏截图frame大小计算有问题
                    continue;
                }
                loop {
                    match capturer.frame() {
                        Ok(frame) => {
                            let stride = (frame.len() / h) as u32;
                            let mut img_buf = RgbaImage::from_fn(w as u32, h as u32, |x, y| {
                                let i = (stride * y + 4 * x) as usize;
                                Rgba([frame[i + 2], frame[i + 1], frame[i], 255])
                            });
                            if do_blur {
                                img_buf = image::imageops::blur(&img_buf, blur_sigma);
                            }
                            ret_list.push(img_buf);
                            break;
                        }
                        Err(err) => {
                            if err.kind() == std::io::ErrorKind::WouldBlock {
                                thread::sleep(Duration::new(1, 0) / 50);
                                println!("block,try next");
                                continue;
                            }
                            println!("{:?}", err);
                            return Err("无法截屏".into());
                        }
                    }
                }
            } else {
                return Err("无法创建屏幕捕捉器".into());
            }
        }
    } else {
        return Err("无法获取屏幕数量".into());
    }
    return Ok(ret_list);
}

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
