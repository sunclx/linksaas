import { Button, message, Modal } from "antd";
import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { writeText } from '@tauri-apps/api/clipboard';



interface UseageModalProps {
  projectId: string;
  robotId: string;
  serverAddr: string;
  token: string;
  onCancel: () => void;
}

export const UseageModal: React.FC<UseageModalProps> = (props) => {
  const installStr = `wget https://www.linksaas.pro/release/robot
chmod a+x ./robot
sudo ./robot install`;

  const configStr =
    `server: ${props.serverAddr}
metric:
  logFile: /var/log/linksaas/metric.log
  # debug:-1,info:0,warn:1,error:2
  logLv: 0
  data: /var/lib/linksaas/data
  scan_interval: 10
  # 数据保存天数
  keep_day: 30
  # 报警最小时间间隔，单位秒
  min_alarm_interval: 300
  cpu:
    # support param: user,system,idle,nice,iowait,irq,softirq,steal,guest,guestNice
    alarm_rule: "idle < 0.05 || system > 0.3"
  disk:
    - path: /
      # support param: total,free,used,usedPercent,inodesTotal,inodesUsed,inodesFree,inodesUsedPercent
      alarm_rule: "usedPercent > 0.9 || inodesUsedPercent > 0.9"
  docker:
    # name对应docker ps里面的NAMES字段
    - name: abc
      # support param: running
      alarm_rule: "running < 0.05"
  load:
    # support param: load1,load5,load15
    alarm_rule: "load1 > 20.0 || load5 > 10.0"
  mem:
    # support param: total,available,used,usedPercent,free
    alarm_rule: "usedPercent > 0.95"
  swap:
    # support param: total,used,free,usedPercent
    alarm_rule: "usedPercent > 0.9"
agent:
  - project: ${props.projectId}
    robot: ${props.robotId}
    token: ${props.token}
    logFile: /var/log/linksaas/agent.log
    # debug:-1,info:0,warn:1,error:2
    logLv: 0        
    `;
    
  const startStr = `systemctl daemon-reload
systemctl enable linksaas_robot
systemctl start linksaas_robot`;

  return (
    <Modal
      title="接入说明"
      open={true}
      footer={null}
      mask={false}
      onCancel={() => props.onCancel()}>
      <ol>
        <li>1. 安装机器人<Button type="link" onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          writeText(installStr).then(() => {
            message.info("复制成功");
          })
        }}>复制</Button>
          <CodeEditor
            value={installStr}
            language="bash"
            disabled
            style={{
              fontSize: 14,
              backgroundColor: '#f5f5f5',
            }}
          />
        </li>
        <li>2.修改/etc/linksaas/robot.yaml配置<Button type="link" onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          writeText(configStr).then(() => {
            message.info("复制成功");
          })
        }}>复制</Button>
          <CodeEditor
            value={configStr}
            language="yaml"
            disabled
            style={{
              fontSize: 14,
              backgroundColor: '#f5f5f5',
              height: "200px",
              overflowY: "scroll",
            }}
          />
        </li>
        <li>3.启动机器人<Button type="link" onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          writeText(startStr).then(() => {
            message.info("复制成功");
          })
        }}>复制</Button>
        <CodeEditor
            value={startStr}
            language="bash"
            disabled
            style={{
              fontSize: 14,
              backgroundColor: '#f5f5f5',
            }}
          />
        </li>
      </ol>
    </Modal>
  );
};