import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Table } from "antd";
import type { Appraise } from '@/api/project_idea';
import { list_appraise, APPRAISE_AGREE, APPRAISE_DIS_AGREE } from '@/api/project_idea';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/lib/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import { DislikeFilled, LikeFilled } from "@ant-design/icons";
import moment from 'moment';

interface IdeaAppraiseModalProps {
    ideaId: string;
    onCancel: () => void;
}

const IdeaAppraiseModal: React.FC<IdeaAppraiseModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [appraiseList, setAppraiseList] = useState<Appraise[]>([]);

    const loadAppraiseList = async () => {
        const res = await request(list_appraise({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.ideaId,
        }));
        setAppraiseList(res.appraise_list);
    };

    const columns: ColumnsType<Appraise> = [
        {
            title: "项目成员",
            render: (_, row: Appraise) => (
                <div>
                    <UserPhoto logoUri={row.member_logo_uri} width="24px" height="24px" style={{ borderRadius: "20px" }} />
                    &nbsp;&nbsp;{row.member_display_name}
                </div>
            ),
        },
        {
            title: "评价",
            render: (_, row: Appraise) => (
                <>
                    {row.appraise_type == APPRAISE_AGREE && <LikeFilled style={{ fontSize: "20px" }} />}
                    {row.appraise_type == APPRAISE_DIS_AGREE && <DislikeFilled style={{ fontSize: "20px" }} />}
                </>
            ),
        },
        {
            title: "评价时间",
            render: (_, row: Appraise) => moment(row.time_stamp).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        loadAppraiseList();
    }, [props.ideaId]);

    return (
        <Modal open title="评价详情" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div style={{ maxHeight: "calc(100vh - 600px)", overflowY: "scroll" }}>
                <Table pagination={false} rowKey="member_user_id" dataSource={appraiseList} columns={columns} />
            </div>
        </Modal>
    );
};

export default observer(IdeaAppraiseModal);
