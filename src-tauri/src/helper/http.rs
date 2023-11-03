use hyper::server::conn::AddrStream;
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response};
use rand::Rng;
use std::convert::Infallible;
use std::net::TcpListener;
use std::path::PathBuf;

// linksaas://comment/bZatbrVH2Ezse1ieo6B3I
fn get_file_type(url_path: &String) -> &str {
    if url_path.ends_with(".abs") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".ai") {
        return "application/postscript";
    }
    if url_path.ends_with(".aif") {
        return "audio/x-aiff";
    }
    if url_path.ends_with(".aifc") {
        return "audio/x-aiff";
    }
    if url_path.ends_with(".aiff") {
        return "audio/x-aiff";
    }
    if url_path.ends_with(".aim") {
        return "application/x-aim";
    }
    if url_path.ends_with(".art") {
        return "image/x-jg";
    }
    if url_path.ends_with(".asf") {
        return "video/x-ms-asf";
    }
    if url_path.ends_with(".asx") {
        return "video/x-ms-asf";
    }
    if url_path.ends_with(".au") {
        return "audio/basic";
    }
    if url_path.ends_with(".avi") {
        return "video/x-msvideo";
    }
    if url_path.ends_with(".avx") {
        return "video/x-rad-screenplay";
    }
    if url_path.ends_with(".bcpio") {
        return "application/x-bcpio";
    }
    if url_path.ends_with(".bin") {
        return "application/octet-stream";
    }
    if url_path.ends_with(".bmp") {
        return "image/bmp";
    }
    if url_path.ends_with(".cdf") {
        return "application/x-cdf";
    }
    if url_path.ends_with(".cer") {
        return "application/x-x509-ca-cert";
    }
    if url_path.ends_with(".class") {
        return "application/java";
    }
    if url_path.ends_with(".cpio") {
        return "application/x-cpio";
    }
    if url_path.ends_with(".csh") {
        return "application/x-csh";
    }
    if url_path.ends_with(".css") {
        return "text/css";
    }
    if url_path.ends_with(".dib") {
        return "image/bmp";
    }
    if url_path.ends_with(".doc") {
        return "application/msword";
    }
    if url_path.ends_with(".dtd") {
        return "text/plain";
    }
    if url_path.ends_with(".dv") {
        return "video/x-dv";
    }
    if url_path.ends_with(".dvi") {
        return "application/x-dvi";
    }
    if url_path.ends_with(".eps") {
        return "application/postscript";
    }
    if url_path.ends_with(".etx") {
        return "text/x-setext";
    }
    if url_path.ends_with(".exe") {
        return "application/octet-stream";
    }
    if url_path.ends_with(".gif") {
        return "image/gif";
    }
    if url_path.ends_with(".gtar") {
        return "application/x-gtar";
    }
    if url_path.ends_with(".gz") {
        return "application/x-gzip";
    }
    if url_path.ends_with(".hdf") {
        return "application/x-hdf";
    }
    if url_path.ends_with(".hqx") {
        return "application/mac-binhex40";
    }
    if url_path.ends_with(".htc") {
        return "text/x-component";
    }
    if url_path.ends_with(".htm") {
        return "text/html";
    }
    if url_path.ends_with(".html") {
        return "text/html";
    }
    if url_path.ends_with(".hqx") {
        return "application/mac-binhex40";
    }
    if url_path.ends_with(".ief") {
        return "image/ief";
    }
    if url_path.ends_with(".jad") {
        return "text/vnd.sun.j2me.app-descriptor";
    }
    if url_path.ends_with(".jar") {
        return "application/java-archive";
    }
    if url_path.ends_with(".java") {
        return "text/plain";
    }
    if url_path.ends_with(".jnlp") {
        return "application/x-java-jnlp-file";
    }
    if url_path.ends_with(".jpe") {
        return "image/jpeg";
    }
    if url_path.ends_with(".jpeg") {
        return "image/jpeg";
    }
    if url_path.ends_with(".jpg") {
        return "image/jpeg";
    }
    if url_path.ends_with(".js") {
        return "text/javascript";
    }
    if url_path.ends_with(".jsf") {
        return "text/plain";
    }
    if url_path.ends_with(".jspf") {
        return "text/plain";
    }
    if url_path.ends_with(".kar") {
        return "audio/x-midi";
    }
    if url_path.ends_with(".latex") {
        return "application/x-latex";
    }
    if url_path.ends_with(".m3u") {
        return "audio/x-mpegurl";
    }
    if url_path.ends_with(".mac") {
        return "image/x-macpaint";
    }
    if url_path.ends_with(".man") {
        return "application/x-troff-man";
    }
    if url_path.ends_with(".me") {
        return "application/x-troff-me";
    }
    if url_path.ends_with(".mid") {
        return "audio/x-midi";
    }
    if url_path.ends_with(".midi") {
        return "audio/x-midi";
    }
    if url_path.ends_with(".mif") {
        return "application/x-mif";
    }
    if url_path.ends_with(".mov") {
        return "video/quicktime";
    }
    if url_path.ends_with(".movie") {
        return "video/x-sgi-movie";
    }
    if url_path.ends_with(".mp1") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".mp2") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".mp3") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".mpa") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".mpe") {
        return "video/mpeg";
    }
    if url_path.ends_with(".mpeg") {
        return "video/mpeg";
    }
    if url_path.ends_with(".mpega") {
        return "audio/x-mpeg";
    }
    if url_path.ends_with(".mpg") {
        return "video/mpeg";
    }
    if url_path.ends_with(".mpv2") {
        return "video/mpeg2";
    }
    if url_path.ends_with(".ms") {
        return "application/x-wais-source";
    }
    if url_path.ends_with(".nc") {
        return "application/x-netcdf";
    }
    if url_path.ends_with(".oda") {
        return "application/oda";
    }
    if url_path.ends_with(".pbm") {
        return "image/x-portable-bitmap";
    }
    if url_path.ends_with(".pct") {
        return "image/pict";
    }
    if url_path.ends_with(".pdf") {
        return "application/pdf";
    }
    if url_path.ends_with(".pgm") {
        return "image/x-portable-graymap";
    }
    if url_path.ends_with(".pic") {
        return "image/pict";
    }
    if url_path.ends_with(".pict") {
        return "image/pict";
    }
    if url_path.ends_with(".pls") {
        return "audio/x-scpls";
    }
    if url_path.ends_with(".png") {
        return "image/png";
    }
    if url_path.ends_with(".pnm") {
        return "image/x-portable-anymap";
    }
    if url_path.ends_with(".pnt") {
        return "image/x-macpaint";
    }
    if url_path.ends_with(".ppm") {
        return "image/x-portable-pixmap";
    }
    if url_path.ends_with(".ps") {
        return "application/postscript";
    }
    if url_path.ends_with(".psd") {
        return "image/x-photoshop";
    }
    if url_path.ends_with(".qt") {
        return "video/quicktime";
    }
    if url_path.ends_with(".qti") {
        return "image/x-quicktime";
    }
    if url_path.ends_with(".qtif") {
        return "image/x-quicktime";
    }
    if url_path.ends_with(".ras") {
        return "image/x-cmu-raster";
    }
    if url_path.ends_with(".rgb") {
        return "image/x-rgb";
    }
    if url_path.ends_with(".rm") {
        return "application/vnd.rn-realmedia";
    }
    if url_path.ends_with(".roff") {
        return "application/x-troff";
    }
    if url_path.ends_with(".rtf") {
        return "application/rtf";
    }
    if url_path.ends_with(".rtx") {
        return "text/richtext";
    }
    if url_path.ends_with(".sh") {
        return "application/x-sh";
    }
    if url_path.ends_with(".shar") {
        return "application/x-shar";
    }
    if url_path.ends_with(".sit") {
        return "application/x-stuffit";
    }
    if url_path.ends_with(".smf") {
        return "audio/x-midi";
    }
    if url_path.ends_with(".snd") {
        return "audio/basic";
    }
    if url_path.ends_with(".src") {
        return "application/x-wais-source";
    }
    if url_path.ends_with(".sv4cpio") {
        return "application/x-sv4cpio";
    }
    if url_path.ends_with(".sv4crc") {
        return "application/x-sv4crc";
    }
    if url_path.ends_with(".swf") {
        return "application/x-shockwave-flash";
    }
    if url_path.ends_with(".t") {
        return "application/x-troff";
    }
    if url_path.ends_with(".tar") {
        return "application/x-tar";
    }
    if url_path.ends_with(".tcl") {
        return "application/x-tcl";
    }
    if url_path.ends_with(".tex") {
        return "application/x-tex";
    }
    if url_path.ends_with(".texi") {
        return "application/x-texinfo";
    }
    if url_path.ends_with(".texinfo") {
        return "application/x-texinfo";
    }
    if url_path.ends_with(".tif") {
        return "image/tiff";
    }
    if url_path.ends_with(".tiff") {
        return "image/tiff";
    }
    if url_path.ends_with(".tr") {
        return "application/x-troff";
    }
    if url_path.ends_with(".tsv") {
        return "text/tab-separated-values";
    }
    if url_path.ends_with(".txt") {
        return "text/plain";
    }
    if url_path.ends_with(".ulw") {
        return "audio/basic";
    }
    if url_path.ends_with(".ustar") {
        return "application/x-ustar";
    }
    if url_path.ends_with(".xbm") {
        return "image/x-xbitmap";
    }
    if url_path.ends_with(".xml") {
        return "text/xml";
    }
    if url_path.ends_with(".xpm") {
        return "image/x-xpixmap";
    }
    if url_path.ends_with(".xsl") {
        return "text/xml";
    }
    if url_path.ends_with(".xwd") {
        return "image/x-xwindowdump";
    }
    if url_path.ends_with(".wav") {
        return "audio/x-wav";
    }
    if url_path.ends_with(".wasm") {
        return "application/wasm";
    }
    if url_path.ends_with(".svg") {
        return "image/svg+xml";
    }
    if url_path.ends_with(".svgz") {
        return "image/svg+xml";
    }
    if url_path.ends_with(".wbmp") {
        return "image/vnd.wap.wbmp";
    }
    if url_path.ends_with(".wml") {
        return "text/vnd.wap.wml";
    }
    if url_path.ends_with(".wmlc") {
        return "application/vnd.wap.wmlc";
    }
    if url_path.ends_with(".wmls") {
        return "text/vnd.wap.wmlscript";
    }
    if url_path.ends_with(".wmlscriptc") {
        return "application/vnd.wap.wmlscriptc";
    }
    if url_path.ends_with(".wrl") {
        return "x-world/x-vrml";
    }
    if url_path.ends_with(".Z") {
        return "application/x-compress";
    }
    if url_path.ends_with(".z") {
        return "application/x-compress";
    }
    if url_path.ends_with(".zip") {
        return "application/zip";
    }
    return "text/html";
}

#[derive(Copy, Clone)]
struct WebRoot {
    root: [u8; 1024],
    len: u16,
}

impl WebRoot {
    fn new(path: String) -> Result<Self, String> {
        let bytes = path.as_bytes();
        if bytes.len() > 1024 {
            return Err("too large string".into());
        }
        let mut root: [u8; 1024] = [0; 1024];
        for item in bytes.into_iter().enumerate() {
            root[item.0] = *item.1;
        }
        Ok(Self {
            root: root,
            len: bytes.len() as u16,
        })
    }
    fn to_string(self) -> Result<String, std::string::FromUtf8Error> {
        let mut vec = Vec::from(self.root);
        vec.truncate(self.len as usize);
        return String::from_utf8(vec);
    }
}

fn random_port() -> u16 {
    let mut rng = rand::thread_rng();
    return rng.gen_range(9001..9099);
}

pub async fn start_http_serv(
    path: String,
    cross_origin_isolated: bool,
) -> Result<(u16, tokio::sync::oneshot::Sender<()>), String> {
    let root = WebRoot::new(path);
    if root.is_err() {
        return Err(root.err().unwrap());
    }
    let root = root.unwrap();
    let make_svc = make_service_fn(move |_: &AddrStream| async move {
        Ok::<_, Infallible>(service_fn(move |req: Request<Body>| async move {
            let root = root.to_string();
            if root.is_err() {
                let resp = Response::builder()
                    .status(500)
                    .body(Body::from(root.err().unwrap().to_string()))
                    .unwrap();
                return Ok::<_, Infallible>(resp);
            } else {
                let mut path = PathBuf::from(root.unwrap());
                req.uri().path().split("/").for_each(|sub_path| {
                    if !sub_path.is_empty() {
                        path.push(sub_path);
                    }
                });
                if req.uri().path().ends_with("/") {
                    path.push("index.html");
                }
                let data = tokio::fs::read(path).await;
                if data.is_err() {
                    let resp = Response::builder()
                        .status(404)
                        .body(Body::from(data.err().unwrap().to_string()))
                        .unwrap();
                    return Ok::<_, Infallible>(resp);
                } else {
                    let mut resp = Response::builder().status(200);
                    let header = resp.headers_mut().unwrap();
                    let req_path = String::from(req.uri().path());
                    let content_type = String::from(get_file_type(&req_path));
                    header.insert("Content-Type", content_type.parse().unwrap());
                    header.insert("Cache-Control", "no-cache".parse().unwrap());
                    header.insert(
                        "Cross-Origin-Resource-Policy",
                        "cross-origin".parse().unwrap(),
                    );
                    if cross_origin_isolated {
                        header.insert(
                            "Cross-Origin-Embedder-Policy",
                            "require-corp".parse().unwrap(),
                        );
                        header.insert("Cross-Origin-Opener-Policy", "same-origin".parse().unwrap());
                    }
                    let resp = resp.body(Body::from(data.unwrap())).unwrap();
                    return Ok::<_, Infallible>(resp);
                }
            }
        }))
    });

    for _ in 0..100 {
        let port = random_port();
        let addr = format!("127.0.0.1:{}", port);
        let listener = TcpListener::bind(&addr);
        if listener.is_err() {
            continue;
        }
        let listener = listener.unwrap();
        let builder = hyper::server::Server::from_tcp(listener);
        if builder.is_err() {
            continue;
        }

        let (tx, rx) = tokio::sync::oneshot::channel::<()>();
        tauri::async_runtime::spawn(async move {
            let server = builder.unwrap().serve(make_svc);
            let graceful = server.with_graceful_shutdown(async {
                rx.await.ok();
            });
            graceful.await.ok();
        });
        return Ok((port as u16, tx));
    }

    Err("no port".into())
}
