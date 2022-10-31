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
    const config =
        `server: ${props.serverAddr}
metric:
  logFile: logs/metric.log
  # debug:-1,info:0,warn:1,error:2
  logLv: 0
  data: data
  scan_interval: 10
  cpu:
    # support param: user,system,idle,nice,iowait,irq,softirq,steal,guest,guestNice
    alarm_rule: "idle < 0.05 || system > 0.3"
  disk:
    - path: /
      # support param: total,free,used,usedPercent,inodesTotal,inodesUsed,inodesFree,inodesUsedPercent
      alarm_rule: "usedPercent > 0.9 || inodesUsedPercent > 0.9"
  docker:
    - name: abc
      # support param: running
      alarm_rule: "int(running) == 0"
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
    `;
    return (
        <Modal
            title="接入说明"
            open={true}
            footer={null}
            mask={false}
            onCancel={() => props.onCancel()}>
            <ol>
                <li>1.下载机器人</li>
                <li>2.安装机器人</li>
                <li>3.使用如下配置<Button type="link" onClick={e=>{
                  e.stopPropagation();
                  e.preventDefault();
                  writeText(config).then(()=>{
                    message.info("复制成功");
                  })
                }}>复制</Button>
                    <CodeEditor
                        value={config}
                        language="yaml"
                        disabled
                        style={{
                            fontSize: 14,
                            backgroundColor: '#f5f5f5',
                            height: "300px",
                            overflowY: "scroll",
                        }}
                    />
                </li>
                <li>4.启动机器人</li>
            </ol>
        </Modal>
    );
};