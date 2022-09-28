import { Avatar } from 'antd';
import React from 'react';


const Logo: React.FC<{ size: number }> = ({ size = 120 }) => (
  <Avatar size={size} src="" />
);

export default Logo;
