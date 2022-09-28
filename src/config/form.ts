import { regexValidator } from '@/utils/utils';

export const formConfig = {
  rule: {
    required: (label?: string, msg?: string) => {
      return { required: true, message: msg || `请填写${label}` };
    },
    textCount: (max: number = 50) => {
      return { max, message: `请不要超过${max}个字符` };
    },
    enText: (msg?: string) => {
      const reg = /^(\w|-)*$/;
      return { validator: regexValidator(reg, msg || '仅支持英文、数字、下划线和-的组合') };
    },
    cnText: (msg?: string) => {
      const reg = /^(?!_)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      return { validator: regexValidator(reg, msg || '仅支持中文、英文、数字和下划线的组合') };
    },
    phone: (msg?: string) => {
      const reg = /^1[3456789]\d{9}$/;
      return { validator: regexValidator(reg, msg || '手机号格式错误') };
    },
    email: (msg?: string) => {
      const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      return { validator: regexValidator(reg, msg || '邮箱地址格式错误') };
    },
    QQ: (msg?: string) => {
      const reg = /^[1-9][0-9]{4,10}$/;
      return { validator: regexValidator(reg, msg || 'QQ 格式错误') };
    },
    wechat: (msg?: string) => {
      const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
      return { validator: regexValidator(reg, msg || '微信格式错误') };
    },
  },

  layout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  },
};
