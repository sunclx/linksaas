import React, { useEffect, useState } from "react";
import type { FloatMsg } from '@/api/project_channel';
import { list_float_msg } from '@/api/project_channel';
import { get_session } from '@/api/user';
import logoPng from '@/assets/allIcon/logo.png';
import { appWindow, currentMonitor, LogicalPosition, LogicalSize } from '@tauri-apps/api/window';
import type * as NoticeType from '@/api/notice_type'
import { listen } from '@tauri-apps/api/event';
import { request } from '@/utils/request';
import styles from './NoticeList.module.less';
import moment from 'moment';
import { platform } from '@tauri-apps/api/os';
import type { FloatNoticeDetailEvent } from '@/utils/float_notice';
import { sendFloatNoticeDetailEvent } from '@/utils/float_notice';


const NoticeList = () => {
    const [noticeList, setNoticeList] = useState<FloatMsg[]>([]);
    const [hover, setHover] = useState(false);
    const [platWin, setPlatWin] = useState(false);

    platform().then((platName: string) => {
        if (platName.includes("win32")) {
            setPlatWin(true);
        }
    })

    const getImgUrl = (imgUrl: string) => {
        if (platWin) {
            return imgUrl.replace('fs://localhost/', 'https://fs.localhost/');
        }
        return imgUrl;
    }

    const loadMsg = async () => {
        const sessionId = await get_session();
        const res = await request(list_float_msg(sessionId));
        if (res) {
            setNoticeList(res.float_msg_list);
        }
    };

    const getRemainMinute = (endTime: number) => {
        const diffTime = moment(endTime).diff(moment());
        return Math.ceil(diffTime / 60 / 1000);
    }

    const adjustPositon = async () => {
        const curPos = await appWindow.outerPosition();
        if (curPos.x > 10 && curPos.y > 10) {
            return;
        }
        const monitor = await currentMonitor();
        if (monitor != null) {
            appWindow.setPosition(new LogicalPosition(monitor.size.width * 0.85, monitor.size.height * 0.05));
        }
    }

    useEffect(() => {
        loadMsg();
        const unlisten = listen<NoticeType.AllNotice>('notice', () => {
            loadMsg();
        });
        return () => {
            unlisten.then(fn => fn());
        };
    }, []);

    useEffect(() => {
        if (noticeList.length == 0) {
            appWindow.setPosition(new LogicalPosition(-1000, -1000));
        } else {
            if (hover) {
                appWindow.setSize(new LogicalSize(300, 400));
            } else {
                appWindow.setSize(new LogicalSize(150, 50));
            }
            adjustPositon();
        }
    }, [noticeList, hover]);

    useEffect(() => {
        const t = setInterval(() => {
            setNoticeList((preList) => {
                const newList = preList.filter(notice => {
                    return getRemainMinute(notice.end_time_stamp) > 0;
                });
                return newList;
            });
        }, 15 * 1000);
        return () => {
            clearInterval(t);
        };
    }, []);

    return (<div
        style={{ overflow: "hidden", padding: "10px 10px", margin: "0px 0px" }}
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
        data-tauri-drag-region={true}
    >

        <span data-tauri-drag-region={true}>
            <img src={logoPng} width="32px" height="32px" style={{ marginRight: "10px" }} data-tauri-drag-region={true} />
            浮动消息:{noticeList.length}
        </span>
        {hover && (
            <div data-tauri-drag-region={true} style={{ overflowY: "scroll", height: "340px", paddingLeft: "10px" }}>
                {noticeList.map(notice => {
                    return (
                        <div key={notice.msg_id} data-tauri-drag-region={true}>
                            <hr />
                            <div>
                                <img src={getImgUrl(notice.sender_logo_uri)} width="24px" height="24px" />
                                <span className={styles.chatName}>{notice.sender_display_name}&nbsp;&nbsp;</span>
                                <span className={styles.chatTime}>{getRemainMinute(notice.end_time_stamp)}分钟后自动移除</span>
                            </div >
                            <div style={{ marginTop: "10px", overflowWrap: "break-word" }}>
                                {notice.title}<a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const ev: FloatNoticeDetailEvent = {
                                        projectId: notice.project_id,
                                        channelId: notice.channel_id,
                                        msgId: notice.msg_id,
                                    }
                                    sendFloatNoticeDetailEvent(ev);
                                }}>查看详情</a>
                            </div>

                        </div>
                    );
                })}
            </div>
        )
        }
    </div>);
}

export default (NoticeList);