import { MenuOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { MenuProps } from 'antd';
import { useStores } from "@/hooks";
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useHistory } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_BOOK_SHELF_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_WORK_PLAN_PATH } from "@/utils/constant";
import { LinkChannelInfo, LinkIdeaPageInfo } from "@/stores/linkAux";
import { get_port } from "@/api/local_api";
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { request } from "@/utils/request";
import { update_setting } from '@/api/project';

const MENU_KEY_SHOW_INVITE_MEMBER = "invite.member.show";
const MENU_KEY_SHOW_TOOL_BAR_APPRAISE = "toolbar.appraise.show"; //查看右侧工具栏成员互评
const MENU_KEY_MEMBER_PREFIX = "member:";
const MENU_KEY_CREATE_CHANNEL = "create.channel";
const MENU_KEY_CHANNEL_PREFIX = "channel:";
const MENU_KEY_WORK_PLAN = "workPlan";
const MENU_KEY_KB_DOC_SPACE = "kb.docSpace";
const MENU_KEY_KB_DOC_RECYCLE = "kb.docRecycle";
const MENU_KEY_CREATE_DOC = "create.doc";
const MENU_KEY_KB_BOOK_SHELF = "kb.bookShelf";
const MENU_KEY_SHOW_TOOL_BAR_IDEA = "toolbar.idea.show"
const MENU_KEY_SHOW_TOOL_BAR_REQUIRE_MENT = "toolbar.requirement.show";
const MENU_KEY_CREATE_REQUIRE_MENT = "crate.requirement";
const MENU_KEY_SHOW_TOOL_BAR_TASK_MY = "toolbar.task.my.show";
const MENU_KEY_SHOW_TOOL_BAR_TASK_ALL = "toolbar.task.all.show";
const MENU_KEY_CREATE_TASK = "create.task";
const MENU_KEY_SHOW_TOOL_BAR_BUG_MY = "toolbar.bug.my.show";
const MENU_KEY_SHOW_TOOL_BAR_BUG_ALL = "toolbar.bug.all.show";
const MENU_KEY_CREATE_BUG = "create.bug";
const MENU_KEY_SHOW_TOOL_BAR_EVENTS = "toolbar.events.show";
const MENU_KEY_SHOW_TOOL_BAR_EVENTS_SUBSCRIBE = "toolbar.eventsSubscribe.show";
const MENU_KEY_SHOW_TOOL_BAR_EXT_EVENTS = "toolbar.extEvents.show";
const MENU_KEY_SHOW_TOOL_BAR_CODE_COMMENT = "toolbar.codeComment.show";
const MENU_KEY_SHOW_TOOL_BAR_APP = "toolbar.app.show";
const MENU_KEY_SHOW_LOCAL_API_DEBUG = "localApi.debug.show";
const MENU_KEY_SHOW_TOOL_BAR_API_COLLECTION = "toolbar.apiColl.show";
const MENU_KEY_SHOW_TOOL_BAR_DATA_ANNO = "toolbar.dataAnno.show";

const MENU_KEY_LAYOUT_PREFIX = "layout.";
const MENU_KEY_LAYOUT_MAIN_CHAT = "layout.main.chat";
const MENU_KEY_LAYOUT_MAIN_WORK_PLAN = "layout.main.workplan";
const MENU_KEY_LAYOUT_MAIN_KB = "layout.main.kb";
const MENU_KEY_LAYOUT_LEFT_WORK_PLAN = "layout.left.workplan";
const MENU_KEY_LAYOUT_LEFT_DOC = "layout.left.doc";
const MENU_KEY_LAYOUT_LEFT_CHANNEL = "layout.left.channel";
const MENU_KEY_LAYOUT_TOOLBAR_APPRAISE = "layout.toolbar.appraise";
const MENU_KEY_LAYOUT_TOOLBAR_API_COLLECTION = "layout.toolbar.apicoll";
const MENU_KEY_LAYOUT_TOOLBAR_DATA_ANNO = "layout.toolbar.dataanno";
const MENU_KEY_LAYOUT_TOOLBAR_EXT_EVENT = "layout.toolbar.extev";
const MENU_KEY_LAYOUT_TOOLBAR_CODE_COMMENT = "layout.toolbar.codecomment";
const MENU_KEY_LAYOUT_TOOLBAR_APP_STORE = "layout.toolbar.appstore";
const MENU_KEY_LAYOUT_OVERVIEW_PROJECT_INFO = "layout.overview.prjinfo";
const MENU_KEY_LAYOUT_OVERVIEW_BULLETIN = "layout.overview.bulletin";
const MENU_KEY_LAYOUT_OVERVIEW_WATCH_TASK = "layout.overview.watchtask";
const MENU_KEY_LAYOUT_OVERVIEW_WATCH_BUG = "layout.overview.watchbug";
const MENU_KEY_LAYOUT_OVERVIEW_EXTRA_INFO = "layout.overview.extrainfo";


const ProjectQuickAccess = () => {
    const userStore = useStores('userStore');
    const memberStore = useStores('memberStore');
    const channelStore = useStores('channelStore');
    const linkAuxStore = useStores('linkAuxStore');
    const projectStore = useStores('projectStore');
    const docSpaceStore = useStores('docSpaceStore');
    const appStore = useStores('appStore');
    const spritStore = useStores('spritStore');

    const history = useHistory();

    const [items, setItems] = useState<MenuProps['items']>([]);

    const calcLayoutItems = (): ItemType => {
        const retItem = {
            key: "layout",
            label: "布局设置",
            children: [
                {
                    key: "layout.main",
                    label: "主面板",
                    children: [
                        {
                            key: MENU_KEY_LAYOUT_MAIN_CHAT,
                            label: `${projectStore.curProject?.setting.disable_chat == true ? "打开" : "关闭"}沟通`
                        },
                        {
                            key: MENU_KEY_LAYOUT_MAIN_WORK_PLAN,
                            label: `${projectStore.curProject?.setting.disable_work_plan == true ? "打开" : "关闭"}工作计划`
                        },
                        {
                            key: MENU_KEY_LAYOUT_MAIN_KB,
                            label: `${projectStore.curProject?.setting.disable_kb == true ? "打开" : "关闭"}知识库`
                        },
                    ],
                },
                {
                    key: "layout.left",
                    label: "左侧项目列表",
                    children: [
                        {
                            key: MENU_KEY_LAYOUT_LEFT_WORK_PLAN,
                            label: `${projectStore.curProject?.setting.hide_watch_walk_plan == true ? "显示" : "隐藏"}工作计划关注列表`
                        },
                        {
                            key: MENU_KEY_LAYOUT_LEFT_DOC,
                            label: `${projectStore.curProject?.setting.hide_watch_doc == true ? "显示" : "隐藏"}文档关注列表`
                        },
                        {
                            key: MENU_KEY_LAYOUT_LEFT_CHANNEL,
                            label: `${projectStore.curProject?.setting.hide_watch_channel == true ? "显示" : "隐藏"}频道关注列表`
                        },
                    ],
                },
                {
                    key: "layout.toolbar",
                    label: "右侧工具栏",
                    children: [
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_APPRAISE,
                            label: `${projectStore.curProject?.setting.disable_member_appraise == true ? "打开" : "关闭"}成员互评`
                        },
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_API_COLLECTION,
                            label: `${projectStore.curProject?.setting.disable_api_collection == true ? "打开" : "关闭"}接口集合`
                        },
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_DATA_ANNO,
                            label: `${projectStore.curProject?.setting.disable_data_anno == true ? "打开" : "关闭"}数据标注`
                        },
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_EXT_EVENT,
                            label: `${projectStore.curProject?.setting.disable_ext_event == true ? "打开" : "关闭"}外部事件接入`
                        },
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_CODE_COMMENT,
                            label: `${projectStore.curProject?.setting.disable_code_comment == true ? "打开" : "关闭"}代码评论`
                        },
                        {
                            key: MENU_KEY_LAYOUT_TOOLBAR_APP_STORE,
                            label: `${projectStore.curProject?.setting.disable_app_store == true ? "打开" : "关闭"}应用市场`
                        },
                    ],
                },
                {
                    key: "layout.overview",
                    label: "项目概览",
                    children: [
                        {
                            key: MENU_KEY_LAYOUT_OVERVIEW_PROJECT_INFO,
                            label: `${projectStore.curProject?.setting.hide_project_info == true ? "显示" : "隐藏"}项目信息`
                        },
                        {
                            key: MENU_KEY_LAYOUT_OVERVIEW_BULLETIN,
                            label: `${projectStore.curProject?.setting.hide_bulletin == true ? "显示" : "隐藏"}项目公告`
                        },
                        {
                            key: MENU_KEY_LAYOUT_OVERVIEW_WATCH_TASK,
                            label: `${projectStore.curProject?.setting.hide_watch_task == true ? "显示" : "隐藏"}关注任务`
                        },
                        {
                            key: MENU_KEY_LAYOUT_OVERVIEW_WATCH_BUG,
                            label: `${projectStore.curProject?.setting.hide_watch_bug == true ? "显示" : "隐藏"}关注缺陷`
                        },
                        {
                            key: MENU_KEY_LAYOUT_OVERVIEW_EXTRA_INFO,
                            label: `${projectStore.curProject?.setting.hide_extra_info == true ? "显示" : "隐藏"}项目其他信息`
                        },
                    ],
                }
            ],
        };
        return retItem;
    }

    const calcItems = () => {
        const tmpItems: MenuProps['items'] = [];
        if (projectStore.isAdmin) {
            tmpItems.push(calcLayoutItems());
        }
        const memberItem = {
            key: "member",
            label: "成员",
            children: [
                {
                    key: MENU_KEY_SHOW_INVITE_MEMBER,
                    label: "邀请成员",
                    disabled: projectStore.curProject?.closed || appStore.clientCfg?.can_invite == false || projectStore.isAdmin == false,
                },
                {
                    key: "members",
                    label: "成员列表",
                    children: memberStore.memberList.map(item => ({
                        key: `${MENU_KEY_MEMBER_PREFIX}${item.member.member_user_id}`,
                        label: item.member.display_name,
                    })),
                }
            ]
        };
        if (projectStore.curProject?.setting.disable_member_appraise != true) {
            memberItem.children.push({
                key: MENU_KEY_SHOW_TOOL_BAR_APPRAISE,
                label: "查看成员互评",
                children: [],
            });
        }
        tmpItems.push(memberItem);
        if (!projectStore.curProject?.setting.disable_chat) {
            tmpItems.push({
                key: "channel",
                label: "沟通",
                children: [
                    {
                        key: MENU_KEY_CREATE_CHANNEL,
                        label: "创建频道",
                    },
                    {
                        key: "channels",
                        label: "频道列表",
                        children: channelStore.channelList.map(item => ({
                            key: `${MENU_KEY_CHANNEL_PREFIX}${item.channelInfo.channel_id}`,
                            label: `${item.channelInfo.basic_info.channel_name}(${item.channelInfo.closed ? "关闭状态" : "激活状态"})`,
                        }))
                    },
                ],
            });
        }
        if (!projectStore.curProject?.setting.disable_work_plan) {
            tmpItems.push({
                key: MENU_KEY_WORK_PLAN,
                label: "工作计划",
            });
        }
        if (!projectStore.curProject?.setting.disable_kb) {
            tmpItems.push({
                key: "kb",
                label: "知识库",
                children: [
                    {
                        key: "doc",
                        label: "文档",
                        children: [
                            {
                                key: MENU_KEY_KB_DOC_SPACE,
                                label: "列出文档",
                            },
                            {
                                key: MENU_KEY_KB_DOC_RECYCLE,
                                label: "查看回收站"
                            },
                            {
                                key: MENU_KEY_CREATE_DOC,
                                label: "创建文档",
                            },
                        ],
                    },
                    {
                        key: MENU_KEY_KB_BOOK_SHELF,
                        label: "项目书籍",
                    },
                ],
            });
        }
        if (projectStore.curProject?.setting.disable_kb != true || projectStore.curProject?.setting.disable_chat != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_IDEA,
                label: "项目知识点",
            });
        }
        tmpItems.push({
            key: "requirement",
            label: "项目需求",
            children: [
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_REQUIRE_MENT,
                    label: "查看项目需求",
                },
                {
                    key: MENU_KEY_CREATE_REQUIRE_MENT,
                    label: "创建项目需求",
                },
            ],
        });
        tmpItems.push({
            key: "task",
            label: "任务",
            children: [
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_TASK_MY,
                    label: "查看我的任务",
                },
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_TASK_ALL,
                    label: "查看所有任务",
                },
                {
                    key: MENU_KEY_CREATE_TASK,
                    label: "创建任务",
                }
            ],
        });
        tmpItems.push({
            key: "bug",
            label: "缺陷",
            children: [
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_BUG_MY,
                    label: "查看我的缺陷",
                },
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_BUG_ALL,
                    label: "查看所有缺陷",
                },
                {
                    key: MENU_KEY_CREATE_BUG,
                    label: "创建缺陷",
                }
            ],
        });
        if (projectStore.curProject?.setting.disable_api_collection != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_API_COLLECTION,
                label: "接口集合",
            });
        }
        if (projectStore.curProject?.setting.disable_data_anno != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_DATA_ANNO,
                label: "数据标注",
            });
        }
        tmpItems.push({
            key: "event",
            label: "研发行为",
            children: [
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_EVENTS,
                    label: "查看研发行为",
                },
                {
                    key: MENU_KEY_SHOW_TOOL_BAR_EVENTS_SUBSCRIBE,
                    label: "订阅研发行为",
                    disabled: projectStore.isAdmin == false,
                },
            ],
        });
        if (projectStore.curProject?.setting.disable_ext_event != true && projectStore.isAdmin) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_EXT_EVENTS,
                label: "查看第三方接入",
            });
        }
        if (projectStore.curProject?.setting.disable_code_comment != true && projectStore.isAdmin) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_CODE_COMMENT,
                label: "查看代码评论",
            });
        }
        if (projectStore.curProject?.setting.disable_app_store != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_APP,
                label: "查看项目应用",
            });
        }
        if (projectStore.curProject?.setting.hide_extra_info != true) {
            tmpItems.push({
                key: "localApi",
                label: "本地接口",
                children: [
                    {
                        key: MENU_KEY_SHOW_LOCAL_API_DEBUG,
                        label: "调试本地接口",
                    }
                ]
            });
        }
        setItems(tmpItems);
    };

    const openApiConsole = async () => {
        const label = "localapi"
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.close();
        }
        const res = await get_port();
        const pos = await appWindow.innerPosition();

        new WebviewWindow(label, {
            url: `local_api.html?port=${res}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: "本地接口调试",
            resizable: true,
            x: pos.x + Math.floor(Math.random() * 200),
            y: pos.y + Math.floor(Math.random() * 200),
        });
    };

    const adjustLayout = async (key: string) => {
        if (projectStore.curProject == undefined) {
            return;
        }
        const newSetting = { ...projectStore.curProject.setting };
        if (key == MENU_KEY_LAYOUT_MAIN_CHAT) {
            newSetting.disable_chat = !projectStore.curProject.setting.disable_chat;
        } else if (key == MENU_KEY_LAYOUT_MAIN_WORK_PLAN) {
            newSetting.disable_work_plan = !projectStore.curProject.setting.disable_work_plan;
        } else if (key == MENU_KEY_LAYOUT_MAIN_KB) {
            newSetting.disable_kb = !projectStore.curProject.setting.disable_kb;
        } else if (key == MENU_KEY_LAYOUT_LEFT_WORK_PLAN) {
            newSetting.hide_watch_walk_plan = !projectStore.curProject.setting.hide_watch_walk_plan;
        } else if (key == MENU_KEY_LAYOUT_LEFT_DOC) {
            newSetting.hide_watch_doc = !projectStore.curProject.setting.hide_watch_doc;
        } else if (key == MENU_KEY_LAYOUT_LEFT_CHANNEL) {
            newSetting.hide_watch_channel = !projectStore.curProject.setting.hide_watch_channel;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_APPRAISE) {
            newSetting.disable_member_appraise = !projectStore.curProject.setting.disable_member_appraise;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_API_COLLECTION) {
            newSetting.disable_api_collection = !projectStore.curProject.setting.disable_api_collection;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_DATA_ANNO) {
            newSetting.disable_data_anno = !projectStore.curProject.setting.disable_data_anno;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_EXT_EVENT) {
            newSetting.disable_ext_event = !projectStore.curProject.setting.disable_ext_event;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_CODE_COMMENT) {
            newSetting.disable_code_comment = !projectStore.curProject.setting.disable_code_comment;
        } else if (key == MENU_KEY_LAYOUT_TOOLBAR_APP_STORE) {
            newSetting.disable_app_store = !projectStore.curProject.setting.disable_app_store;
        } else if (key == MENU_KEY_LAYOUT_OVERVIEW_PROJECT_INFO) {
            newSetting.hide_project_info = !projectStore.curProject.setting.hide_project_info;
        } else if (key == MENU_KEY_LAYOUT_OVERVIEW_BULLETIN) {
            newSetting.hide_bulletin = !projectStore.curProject.setting.hide_bulletin;
        } else if (key == MENU_KEY_LAYOUT_OVERVIEW_WATCH_TASK) {
            newSetting.hide_watch_task = !projectStore.curProject.setting.hide_watch_task;
        } else if (key == MENU_KEY_LAYOUT_OVERVIEW_WATCH_BUG) {
            newSetting.hide_watch_bug = !projectStore.curProject.setting.hide_watch_bug;
        } else if (key == MENU_KEY_LAYOUT_OVERVIEW_EXTRA_INFO) {
            newSetting.hide_extra_info = !projectStore.curProject.setting.hide_extra_info;
        }

        await request(update_setting({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            setting: newSetting,
        }));
        await projectStore.updateProject(projectStore.curProjectId);
    };

    const onMenuClick = async (info: MenuInfo) => {
        switch (info.key) {
            case MENU_KEY_SHOW_INVITE_MEMBER:
                memberStore.showInviteMember = true;
                break;
            case MENU_KEY_SHOW_TOOL_BAR_APPRAISE:
                linkAuxStore.goToAppriaseList(history);
                break;
            case MENU_KEY_CREATE_CHANNEL:
                history.push(APP_PROJECT_CHAT_PATH);
                channelStore.showCreateChannel = true;
                break;
            case MENU_KEY_WORK_PLAN:
                spritStore.setCurSpritId("");
                history.push(APP_PROJECT_WORK_PLAN_PATH);
                break;
            case MENU_KEY_KB_DOC_SPACE:
                history.push(APP_PROJECT_KB_DOC_PATH);
                if (appStore.simpleMode) {
                    appStore.simpleMode = false;
                }
                docSpaceStore.showDocList("", false);
                break;
            case MENU_KEY_KB_DOC_RECYCLE:
                history.push(APP_PROJECT_KB_DOC_PATH);
                if (appStore.simpleMode) {
                    appStore.simpleMode = false;
                }
                docSpaceStore.showDocList("", true);
                break;
            case MENU_KEY_CREATE_DOC:
                linkAuxStore.goToCreateDoc("", projectStore.curProjectId, projectStore.curProject?.default_doc_space_id ?? "", history);
                break;
            case MENU_KEY_KB_BOOK_SHELF:
                history.push(APP_PROJECT_KB_BOOK_SHELF_PATH);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_IDEA:
                linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", []), history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_REQUIRE_MENT:
                linkAuxStore.goToRequirementList(history);
                break;
            case MENU_KEY_CREATE_REQUIRE_MENT:
                linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_TASK_MY:
                linkAuxStore.goToTaskList(undefined, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_TASK_ALL:
                linkAuxStore.goToTaskList({
                    stateList: [],
                    execUserIdList: [],
                    checkUserIdList: [],
                }, history);
                break;
            case MENU_KEY_CREATE_TASK:
                linkAuxStore.goToCreateTask("", projectStore.curProjectId, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_BUG_MY:
                linkAuxStore.goToBugList(undefined, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_BUG_ALL:
                linkAuxStore.goToBugList({
                    stateList: [],
                    execUserIdList: [],
                    checkUserIdList: [],
                }, history);
                break;
            case MENU_KEY_CREATE_BUG:
                linkAuxStore.goToCreateBug("", projectStore.curProjectId, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_EVENTS:
                linkAuxStore.goToEventList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_EVENTS_SUBSCRIBE:
                linkAuxStore.goToEventSubscribeList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_EXT_EVENTS:
                linkAuxStore.goToExtEventList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_CODE_COMMENT:
                linkAuxStore.goToCodeThreadList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_APP:
                linkAuxStore.goToAppList(history);
                break;
            case MENU_KEY_SHOW_LOCAL_API_DEBUG:
                await openApiConsole();
                break;
            case MENU_KEY_SHOW_TOOL_BAR_API_COLLECTION:
                linkAuxStore.goToApiCollectionList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_DATA_ANNO:
                linkAuxStore.goToDataAnnoList(history);
                break;
            default:
                if (info.key.startsWith(MENU_KEY_LAYOUT_PREFIX)) {
                    adjustLayout(info.key);
                }
        }
        if (info.key.startsWith(MENU_KEY_MEMBER_PREFIX)) {
            const memberUserId = info.key.substring(MENU_KEY_MEMBER_PREFIX.length);
            memberStore.floatMemberUserId = memberUserId;
        } else if (info.key.startsWith(MENU_KEY_CHANNEL_PREFIX)) {
            const channelId = info.key.substring(MENU_KEY_CHANNEL_PREFIX.length);
            linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, channelId), history);
        }
    }

    useEffect(() => {
        calcItems();
    }, [projectStore.curProject?.setting, projectStore.curProjectId, memberStore.memberList, channelStore.channelList]);

    return (
        <Dropdown overlayStyle={{ minWidth: "100px" }} menu={{ items, subMenuCloseDelay: 0.05, onClick: (info: MenuInfo) => onMenuClick(info) }} trigger={["click"]} >
            <a onClick={(e) => e.preventDefault()} style={{ margin: "0px 20px", color: "orange", fontSize: "18px" }} title="项目快捷菜单">
                <MenuOutlined />
            </a>
        </Dropdown >
    );
};

export default observer(ProjectQuickAccess);