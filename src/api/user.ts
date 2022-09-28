import { invoke } from '@tauri-apps/api/tauri';

export type GenCaptchaResponse = {
  code: number;
  err_msg: string;
  captcha_id: string;
  ///base64编码的图片
  base64_image: string;
};

type PreRegisterResponse = {
  code: number;
  err_msg: string;
};

type BasicUserInfo = {
  display_name: string;
  logo_uri: string;
};

type RegisterRequest = {
  user_name: string;
  basic_info: BasicUserInfo;
  auth_code: string;
  passwd: string;
};

type RegisterResponse = {
  code: number;
  err_msg: string;
};

type UserInfo = {
  user_id: string;
  user_name: string;
  basic_info: BasicUserInfo;
  create_time: number;
  update_time: number;
  user_fs_id: string;
  default_kb_space_id: string;
};

type LoginResponse = {
  code: number;
  err_msg: string;
  session_id: string;
  user_info: UserInfo;
  notice_url: string;
  notice_key: string;
};

type LogoutResponse = {
  code: number;
  err_msg: string;
};

type UpdateResponse = {
  code: number;
  err_msg: string;
};

export type ChangePasswdResponse = {
  code: number;
  err_msg: string;
};

export type PreResetPasswordResponse = {
  code: number;
  err_msg: string;
};

export type ResetPasswordResponse = {
  code: number;
  err_msg: string;
};

type CheckSessionResponse = {
  code: number;
  err_msg: string;
  valid: boolean;
};

//生成图片验证码
export async function gen_captcha(): Promise<GenCaptchaResponse> {
  return invoke<GenCaptchaResponse>('plugin:user_api|gen_captcha', {
    request: {},
  });
}

//预注册，主要用来发送验证码
export async function pre_register(
  user_name: string,
  captcha_id: string,
  captcha_value: string,
): Promise<PreRegisterResponse> {
  const cmd = 'plugin:user_api|pre_register';
  console.log(cmd, user_name);
  return invoke<PreRegisterResponse>('plugin:user_api|pre_register', {
    request: {
      user_name: user_name,
      captcha_id: captcha_id,
      captcha_value: captcha_value,
    },
  });
}

//通过验证码来注册用户
export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const cmd = 'plugin:user_api|register';
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<RegisterResponse>('plugin:user_api|register', {
    request: request,
  });
}

/* 用户登录，登录后
 * 1. 自动进行会话保活
 * 2. 启动对应用户的通知推送功能
 */
export async function login(user_name: string, passwd: string): Promise<LoginResponse> {
  const cmd = 'plugin:user_api|login';
  const request = {
    user_name,
    passwd,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<LoginResponse>(cmd, {
    request,
  });
}

/* 用户登出
 * 1. 停止相关用户的会话保活
 * 2. 停止对应用户的通知推送功能
 */
export async function logout(session_id: string): Promise<LogoutResponse> {
  const cmd = 'plugin:user_api|logout';
  const request = {
    session_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<LogoutResponse>('plugin:user_api|logout', {
    request,
  });
}

//更新用户信息
export async function update(
  session_id: string,
  basic_info: BasicUserInfo,
): Promise<UpdateResponse> {
  const cmd = 'plugin:user_api|update';
  const request = {
    session_id,
    basic_info,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<UpdateResponse>('plugin:user_api|update', {
    request,
  });
}

//修改密码
export async function change_passwd(
  session_id: string,
  old_passwd: string,
  new_passwd: string,
): Promise<ChangePasswdResponse> {
  const cmd = 'plugin:user_api|change_passwd';
  const request = {
    session_id,
    old_passwd,
    new_passwd,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);
  return invoke<ChangePasswdResponse>(cmd, {
    request,
  });
}

//预重设密码
export async function pre_reset_password(
  user_name: string,
  captcha_id: string,
  captcha_value: string,
): Promise<PreResetPasswordResponse> {
  console.log(user_name, captcha_id, captcha_value);

  return invoke<PreResetPasswordResponse>('plugin:user_api|pre_reset_password', {
    request: {
      user_name: user_name,
      captcha_id: captcha_id,
      captcha_value: captcha_value,
    },
  });
}

//重设密码
export async function reset_password(
  user_name: string,
  auth_code: string,
  passwd: string,
): Promise<ResetPasswordResponse> {
  console.log(user_name, auth_code, passwd);

  return invoke<ResetPasswordResponse>('plugin:user_api|reset_password', {
    request: {
      user_name: user_name,
      auth_code: auth_code,
      passwd: passwd,
    },
  });
}

//检查会话是否有效
export async function check_session(session_id: string): Promise<CheckSessionResponse> {
  const cmd = 'plugin:user_api|check_session';
  const request = {
    session_id,
  };
  console.log(`%c${cmd}`, 'color:#0f0;', request);

  return invoke<CheckSessionResponse>(cmd, {
    request,
  });
}

//设置当前快照项目
export function set_cur_work_snapshot(project_id: string) {
  invoke<null>('plugin:user_api|set_cur_work_snapshot', {
    projectId: project_id,
  }).finally(()=>{
    
  });
}
