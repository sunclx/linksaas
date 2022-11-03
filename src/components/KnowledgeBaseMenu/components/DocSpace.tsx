import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import s from './DocSpace.module.less';
import classNames from 'classnames';
import type { DocSpace as DocSpaceType } from '@/api/project_doc';
import { remove_doc_space, update_doc_space } from '@/api/project_doc';
import { request } from '@/utils/request';
import { Popover, Modal, Input, message } from 'antd';
import { APP_PROJECT_KB_DOC_PATH } from "@/utils/constant";
import { useHistory } from "react-router-dom";


const RenderMoreMenu: React.FC<{ docSpaceId: string, canUpdate: boolean, canRemove: boolean, title: string }> =
    ({ docSpaceId, canUpdate, canRemove, title }) => {
        const userStore = useStores('userStore');
        const projectStore = useStores('projectStore');
        const docSpaceStore = useStores('docSpaceStore');

        const [showUpdateModal, setShowUpdateModal] = useState(false);
        const [docSpaceTitle, setDocSpaceTitle] = useState(title);

        const removeDocSpace = async () => {
            if (!canRemove) {
                return;
            }
            const res = await request(remove_doc_space({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                doc_space_id: docSpaceId,
            }));
            if (res) {
                docSpaceStore.removeDocSpace(docSpaceId);
                message.info("删除文档空间成功");
            }
        };

        const updateDocSpace = async () => {
            const res = await request(update_doc_space({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                doc_space_id: docSpaceId,
                base_info: {
                    title: docSpaceTitle,
                },
            }));
            if (res) {
                await docSpaceStore.updateDocSpace(docSpaceId);
                setShowUpdateModal(false);
                message.info("修改文档空间成功");
            }
        };

        return (
            <div className={s.moremenu}>
                <div className={s.menu_item}>
                    <span className={canUpdate ? s.active : ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (canUpdate) {
                            setShowUpdateModal(true);
                        }
                    }}>修改</span>
                </div>
                <div className={s.menu_item}>
                    <span className={canRemove ? s.active : ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeDocSpace();
                    }}>删除</span>
                </div>
                {showUpdateModal && (
                    <Modal title="修改文档空间名称" open={showUpdateModal}
                        onCancel={() => setShowUpdateModal(false)}
                        onOk={() => updateDocSpace()}
                    >
                        <Input addonBefore="文档空间名称" defaultValue={docSpaceTitle} onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDocSpaceTitle(e.target.value);
                        }} />
                    </Modal>
                )}
            </div>
        )
    };

const DocSpaceItem: React.FC<{ docSpace: DocSpaceType }> = observer(({ docSpace }) => {
    const history = useHistory();
    const docSpaceStore = useStores('docSpaceStore');
    const [hover, setHover] = useState(false);

    return (<li key={docSpace.doc_space_id}
        className={classNames(s.list_item, docSpace.doc_space_id == docSpaceStore.curDocSpaceId ? s.current : "")}
        onMouseOver={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(true);
        }}
        onMouseOut={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(false);
        }}
    >
        <div className={s.title}
            onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (docSpaceStore.inEdit) {
                    docSpaceStore.showCheckLeave(() => {
                        docSpaceStore.showDocList(docSpace.doc_space_id, false);
                    });
                    return;
                }
                docSpaceStore.showDocList(docSpace.doc_space_id, false);
                history.push(APP_PROJECT_KB_DOC_PATH);
            }}
        >
            {docSpace.base_info.title}
        </div>
        <Popover
            placement="left"
            content={<RenderMoreMenu
                docSpaceId={docSpace.doc_space_id}
                canUpdate={docSpace.user_perm.can_update}
                canRemove={docSpace.user_perm.can_remove}
                title={docSpace.base_info.title} />}
            autoAdjustOverflow={false}
        >
            {hover && !docSpace.system_doc_space &&
                <a className={s.more}>
                    <i className={s.icon} />
                </a>
            }
        </Popover>
    </li>);
});


const DocSpace = () => {
    const docSpaceStore = useStores('docSpaceStore');
    const projectStore = useStores('projectStore');

    useEffect(() => {
        docSpaceStore.loadDocSpace();
    }, [projectStore.curProjectId]);

    return <>
        <ul className={s.list}>
            {docSpaceStore.docSpaceList.map(docSpace => (<DocSpaceItem key={docSpace.doc_space_id} docSpace={docSpace} />))}
        </ul>
    </>;
};

export default observer(DocSpace);
