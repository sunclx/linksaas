fn main() {
  tauri_build::build();
  //  if let Err(error) = tauri_build::try_build(tauri_build::Attributes::default()){
  //   if let Ok(env) = std::env::var("TAURI_CONFIG") {
  //     panic!("error found during tauri-build: {}", env);
  //   }else{
  //     println!("111111");
  //   }
  //   println!("{:?}",error)
  // }
}
