import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { RobotInfo as RepoRobotInfo } from '@/api/robot_earthly';
import { EditOutlined } from "@ant-design/icons";
import { Select } from "antd";
import type { RobotInfo } from "@/api/robot";
import { list as list_robot } from "@/api/robot";
import { useStores } from "@/hooks";
import { request } from '@/utils/request';
import { useHistory } from "react-router-dom";


interface EditRobotListProps {
    editable: boolean;
    robotInfoList: RepoRobotInfo[];
    showEditIcon: boolean;
    onAddRobot: (robotId: string) => Promise<boolean>;
    onRemoveRobot: (robotId: string) => Promise<boolean>;
}
// 

const EditRobotList: React.FC<EditRobotListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [inEdit, setInEdit] = useState(false);
    const [robotList, setRobotList] = useState(props.robotInfoList);
    const [allRobotList, setAllRobotList] = useState<RobotInfo[]>([]);

    const changeRobot = async (newRobotIdList: string[]) => {
        //检查是否是删除
        let removeRobotId = "";
        robotList.forEach(robot => {
            if (!newRobotIdList.includes(robot.robot_id)) {
                removeRobotId = robot.robot_id;
            }
        })
        if (removeRobotId != "") {
            const res = await props.onRemoveRobot(removeRobotId);
            if (!res) {
                return;
            }
        }
        //检查是否是新增
        let addRobotId = "";
        newRobotIdList.forEach(robotId => {
            const index = robotList.findIndex(robot => robot.robot_id == robotId);
            if (index == -1) {
                addRobotId = robotId;
            }
        })
        if (addRobotId != "") {
            const res = await props.onAddRobot(addRobotId);
            if (!res) {
                return;
            }
        }
        //更新robotList 
        const tmpRobotList: RepoRobotInfo[] = [];
        newRobotIdList.forEach(robotId => {
            const index = allRobotList.findIndex(robot => robot.robot_id == robotId);
            if (index != -1) {
                tmpRobotList.push({
                    robot_id: robotId,
                    robot_name: allRobotList[index].basic_info.name,
                    can_access: projectStore.isAdmin,
                });
            }
        })
        setRobotList(tmpRobotList);
    };

    const loadAllRobot = async () => {
        const res = await request(list_robot({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: 0,
            limit: 999,
        }));
        if (res) {
            setAllRobotList(res.robot_list);
        }
    };

    useEffect(() => {
        if (inEdit) {
            loadAllRobot();
        }
    }, [inEdit]);

    return <div onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        if (props.editable) {
            setInEdit(true);
        }
    }}>
        {!inEdit && (
            <div>
                {robotList.map(robot => (
                    <span key={robot.robot_id} style={{ display: "inline-block", marginRight: "10px" }}>
                        {robot.can_access == false && robot.robot_name}
                        {robot.can_access == true && <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToRobotList(history);
                        }}>{robot.robot_name}</a>}
                    </span>
                ))}
                {props.editable && props.showEditIcon &&
                    <a><EditOutlined /></a>
                }
            </div>
        )}
        {inEdit && (
            <Select
                autoFocus
                mode="multiple"
                showSearch={false}
                value={robotList.map(robot => robot.robot_id)}
                open={true}
                onChange={value => changeRobot(value)}
                onBlur={() => setInEdit(false)}
                style={{ width: "100%" }}
            >
                {allRobotList.map(robot => (
                    <Select.Option key={robot.robot_id} value={robot.robot_id}>
                        {robot.basic_info.name}
                    </Select.Option>
                ))}
            </Select>
        )}
    </div>
};

export default observer(EditRobotList);