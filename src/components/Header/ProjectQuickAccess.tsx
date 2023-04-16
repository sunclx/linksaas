import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { MenuProps } from 'antd';
import { useStores } from "@/hooks";
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useHistory } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_BOOK_SHELF_PATH, APP_PROJECT_KB_DOC_PATH, PROJECT_TOOL_TYPE } from "@/utils/constant";
import { LinkBookMarkCateInfo, LinkChannelInfo, LinkIdeaPageInfo } from "@/stores/linkAux";
import { get_port } from "@/api/local_api";
import { WebviewWindow } from '@tauri-apps/api/window';
import { LAYOUT_TYPE_CHAT, LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB, LAYOUT_TYPE_KB_AND_CHAT } from "@/api/project";

const MENU_KEY_SHOW_INVITE_MEMBER = "invite.member.show";
const MENU_KEY_SHOW_TOOL_BAR_APPRAISE = "toolbar.appraise.show"; //查看右侧工具栏成员互评
const MENU_KEY_MEMBER_PREFIX = "member:";
const MENU_KEY_CREATE_CHANNEL = "create.channel";
const MENU_KEY_CHANNEL_PREFIX = "channel:";
const MENU_KEY_KB_DOC_SPACE = "kb.docSpace";
const MENU_KEY_KB_DOC_RECYCLE = "kb.docRecycle";
const MENU_KEY_CREATE_DOC = "create.doc";
const MENU_KEY_KB_BOOK_SHELF = "kb.bookShelf";
const MENU_KEY_KB_BOOK_MARK = "kb.bookMark";
const MENU_KEY_SHOW_TOOL_BAR_IDEA = "toolbar.idea.show"
const MENU_KEY_SHOW_TOOL_BAR_REQUIRE_MENT = "toolbar.requirement.show";
const MENU_KEY_CREATE_REQUIRE_MENT = "crate.requirement";
const MENU_KEY_SHOW_TOOL_BAR_TASK_MY = "toolbar.task.my.show";
const MENU_KEY_SHOW_TOOL_BAR_TASK_ALL = "toolbar.task.all.show";
const MENU_KEY_CREATE_TASK = "create.task";
const MENU_KEY_SHOW_TOOL_BAR_BUG_MY = "toolbar.bug.my.show";
const MENU_KEY_SHOW_TOOL_BAR_BUG_ALL = "toolbar.bug.all.show";
const MENU_KEY_CREATE_BUG = "create.bug";
const MENU_KEY_SHOW_TOOL_BAR_TEST_CASE = "toolbar.testcase.show";
const MENU_KEY_SHOW_TOOL_BAR_SPRIT = "toolbar.sprit.show";
const MENU_KEY_CREATE_SPRIT = "create.sprit";
const MENU_KEY_SHOW_TOOL_BAR_ROBOT = "toolbar.robot.show";
const MENU_KEY_SHOW_TOOL_BAR_SCRIPT = "toolbar.script.show";
const MENU_KEY_SHOW_TOOL_BAR_EARTHLY = "toolbar.earthly.show";
const MENU_KEY_SHOW_TOOL_BAR_EVENTS = "toolbar.events.show";
const MENU_KEY_SHOW_TOOL_BAR_EVENTS_SUBSCRIBE = "toolbar.eventsSubscribe.show";
const MENU_KEY_SHOW_TOOL_BAR_EXT_EVENTS = "toolbar.extEvents.show";
const MENU_KEY_SHOW_TOOL_BAR_APP = "toolbar.app.show";
const MENU_KEY_SHOW_LOCAL_API_DEBUG = "localApi.debug.show";
const MENU_KEY_SHOW_TOOL_GIT_HOOk = "tool.gitHook.show";



const ProjectQuickAccess = () => {
    const memberStore = useStores('memberStore');
    const channelStore = useStores('channelStore');
    const linkAuxStore = useStores('linkAuxStore');
    const projectStore = useStores('projectStore');
    const docSpaceStore = useStores('docSpaceStore');
    const spritStore = useStores('spritStore');
    const appStore = useStores('appStore');

    const history = useHistory();

    const [items, setItems] = useState<MenuProps['items']>([]);

    const calcItems = () => {
        const tmpItems: MenuProps['items'] = [];
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
        if ([LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_CHAT].includes(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB)) {
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
        if ([LAYOUT_TYPE_CHAT_AND_KB, LAYOUT_TYPE_KB_AND_CHAT, LAYOUT_TYPE_KB].includes(projectStore.curProject?.setting.layout_type ?? LAYOUT_TYPE_CHAT_AND_KB)) {
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
                        key: MENU_KEY_KB_BOOK_MARK,
                        label: "项目书签"
                    },
                    {
                        key: MENU_KEY_KB_BOOK_SHELF,
                        label: "电子书库",
                    },
                ],
            });
        }
        tmpItems.push({
            key: MENU_KEY_SHOW_TOOL_BAR_IDEA,
            label: "项目知识点",
        })
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
        if (projectStore.curProject?.setting.disable_test_case != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_TEST_CASE,
                label: "测试用例",
            });
        }
        if (projectStore.curProject?.setting.disable_sprit != true) {
            tmpItems.push({
                key: "sprit",
                label: "迭代",
                children: [
                    {
                        key: MENU_KEY_SHOW_TOOL_BAR_SPRIT,
                        label: "查看迭代列表",
                    },
                    {
                        key: MENU_KEY_CREATE_SPRIT,
                        label: "创建迭代",
                    }
                ]
            });
        }
        if (projectStore.curProject?.setting.disable_server_agent != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_ROBOT,
                label: "服务器代理列表",
            });
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_SCRIPT,
                label: "服务端脚本列表",
            });
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_EARTHLY,
                label: "代码仓库列表",
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
        if (projectStore.curProject?.setting.disable_ext_event != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_EXT_EVENTS,
                label: "查看第三方接入",
            });
        }
        if (projectStore.curProject?.setting.disable_app_store != true) {
            tmpItems.push({
                key: MENU_KEY_SHOW_TOOL_BAR_APP,
                label: "查看项目应用",
            });
        }
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
        tmpItems.push({
            key: "projectTool",
            label: "项目工具",
            children: [
                {
                    key: MENU_KEY_SHOW_TOOL_GIT_HOOk,
                    label: "设置GitHooks",
                },
            ]
        });
        setItems(tmpItems);
    };

    const openApiConsole = async () => {
        const label = "localapi"
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.close();
        }
        const res = await get_port();
        new WebviewWindow(label, {
            url: `local_api.html?port=${res}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: "本地接口调试",
            resizable: true,
        });
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
            case MENU_KEY_KB_BOOK_MARK:
                linkAuxStore.goToLink(new LinkBookMarkCateInfo("", projectStore.curProjectId, ""), history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_IDEA:
                linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", []), history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_REQUIRE_MENT:
                linkAuxStore.goToRequirementList(history);
                break;
            case MENU_KEY_CREATE_REQUIRE_MENT:
                linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, "", history);
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
            case MENU_KEY_SHOW_TOOL_BAR_TEST_CASE:
                linkAuxStore.goToTestCaseList({ entryId: "" }, history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_SPRIT:
                linkAuxStore.goToSpritList(history);
                break;
            case MENU_KEY_CREATE_SPRIT:
                linkAuxStore.goToSpritList(history);
                spritStore.showCreateSprit = true;
                break;
            case MENU_KEY_SHOW_TOOL_BAR_ROBOT:
                linkAuxStore.goToRobotList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_SCRIPT:
                linkAuxStore.goToScriptList(history);
                break;
            case MENU_KEY_SHOW_TOOL_BAR_EARTHLY:
                linkAuxStore.goToRepoList(history);
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
            case MENU_KEY_SHOW_TOOL_BAR_APP:
                linkAuxStore.goToAppList(history);
                break;
            case MENU_KEY_SHOW_LOCAL_API_DEBUG:
                await openApiConsole();
                break;
            case MENU_KEY_SHOW_TOOL_GIT_HOOk:
                projectStore.projectTool = PROJECT_TOOL_TYPE.PROJECT_TOOL_GIT_HOOk;
                break;
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
            <a onClick={(e) => e.preventDefault()} style={{ margin: "0px 0px" }}>
                <Space>
                    快捷菜单
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown >
    );
};

export default observer(ProjectQuickAccess);