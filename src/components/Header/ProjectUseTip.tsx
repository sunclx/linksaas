import { Button, Card, Popover, Space } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { AlertTwoTone, DislikeOutlined, ExportOutlined, LikeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_KB_BOOK_SHELF_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH, PROJECT_TOOL_TYPE } from "@/utils/constant";
import ReqBtn from '@/assets/allIcon/icon-req.png';
import IdeaBtn from '@/assets/allIcon/icon-idea.png';
import ScriptBtn from '@/assets/allIcon/icon-script.png';
import RepoBtn from '@/assets/allIcon/icon-repo.png';
import RecordBtn from '@/assets/allIcon/icon-record.png';
import AccessBtn from '@/assets/allIcon/icon-access.png';
import AppraiseBtn from '@/assets/allIcon/icon-appraise.png';
import { LinkChannelInfo } from "@/stores/linkAux";
import { open } from '@tauri-apps/api/shell';
import ReqQuickBtn from "@/assets/channel/req@2x.png";
import BugQuickBtn from "@/assets/channel/bug@2x.png";
import TaskQuickBtn from "@/assets/channel/task@2x.png";
import IdeaQuickBtn from "@/assets/channel/idea@2x.png";
import CollectBtn from "@/assets/allIcon/collect.png";
import NoCollectBtn from "@/assets/allIcon/no_collect.png";


interface TipInfo {
    title: string;
    content: React.ReactNode;
    enable: boolean;
}

const ProjectUseTip = () => {
    const history = useHistory();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');
    const linkAuxStore = useStores('linkAuxStore');
    const ideaStore = useStores('ideaStore');
    const spritStore = useStores('spritStore');
    const docSpaceStore = useStores('docSpaceStore');

    const [tipList, setTipList] = useState<TipInfo[]>([]);
    const [curTipIndex, setCurTipIndex] = useState(0);

    const allTipList: TipInfo[] = [
        {
            title: "邀请成员加入项目",
            content: (<>
                <p>你可以通过进入<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(APP_PROJECT_OVERVIEW_PATH);
                }}>项目概览</a>中的成员信息栏，点击<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    memberStore.showInviteMember = true;
                }}>邀请成员</a>。</p>
                <p>受邀人员，可以通过左侧项目栏上的加号，选择<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    appStore.showJoinProject = true;
                }}>加入项目</a>。</p>
            </>),
            enable: memberStore.memberList.length == 1,
        },
        {
            title: "统一项目目标",
            content: (<>
                <p>通过大家一起指定下一个阶段的目标，让大家明确目标和方向。</p>
                <p>你可以进入<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(APP_PROJECT_OVERVIEW_PATH);
                }}>项目概览</a>中的程序信息栏，点击新建目标(OKR)来创建目标。</p>
            </>),
            enable: true,
        },
        {
            title: "让需求安排更合理",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRequirementList(history);
                }}><img src={ReqBtn} /></a>打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRequirementList(history);
                }}>需求面板</a>。</p>
                <p>我们提供了经典的四象限和Kano评估法，利用这些评估方法可以让需求安排更加合理。</p>
            </>),
            enable: true,
        },
        {
            title: "随时随地积累知识",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToIdeaList(history);
                }}><img src={IdeaBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToIdeaList(history);
                }}>知识点面板</a>。</p>
                <p>你可以通过面板顶部的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    ideaStore.setShowCreateIdea("", `{"doc":{}}`);
                }}>创建知识点按钮</a>，录入知识。</p>
                <p>知识点上的关键词，在文档或沟通中，会对匹配的内容自动高亮显示。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false && projectStore.curProject?.setting.disable_kb === false,
        },
        {
            title: "保证知识的有效性",
            content: (<>
                <p>保证知识点的有效性，可以大幅提高知识库的质量。</p>
                <p>当你查看某个具体的知识时，可用通过知识点右侧的<LikeOutlined style={{ fontSize: "20px" }} />或<DislikeOutlined style={{ fontSize: "20px" }} />来进行投票。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false && projectStore.curProject?.setting.disable_kb === false,
        },
        {
            title: "安全的执行服务端脚本",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToScriptList(history);
                }}><img src={ScriptBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToScriptList(history);
                }}>服务端脚本面板</a>。</p>
                <p>服务端脚本是非常安全的，网络权限，文件权限，系统信息等权限都是需要明确授予的。</p>
                <p>你还可以对之前的执行记录进行回放。</p>
                <p>注意：需要管理员先在<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRobotList(history);
                }}>服务器列表</a>上添加服务器代理，服务端脚本是通过服务器代理来执行的。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_server_agent === false,
        },
        {
            title: "使用earthly进行CI/CD",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRepoList(history);
                }}><img src={RepoBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRepoList(history);
                }}>代码仓库列表</a>。</p>
                <p>注意：需要管理员先在<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToRobotList(history);
                }}>服务器列表</a>上添加服务器代理，earthly脚本是通过服务器代理来执行的。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_server_agent === false,
        },
        {
            title: "订阅研发行为",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}><img src={RecordBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}>工作记录面板</a>，通过点击顶部下来菜单的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventSubscribeList(history);
                }}>订阅研发事件</a>进入。</p>
                <p>通过订阅研发行为，你可以在钉钉，企业微信，飞书上快速了解研发行为。</p>
            </>),
            enable: projectStore.isAdmin,
        },
        {
            title: "简化日报工作",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}><img src={RecordBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}>工作记录面板</a>, 并点击顶部的补充工作记录按钮</p>
            </>),
            enable: true,
        },
        {
            title: "合理评估项目成员",
            content: (<>
                <p>对项目成员合理的评估，可以提高团队战斗力。</p>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToAppriaseList(history);
                }}><img src={AppraiseBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToAppriaseList(history);
                }}>项目成员互评面板</a>。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_member_appraise === false,
        },
        {
            title: "接入代码仓库行为",
            content: (<>
                <p>你可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToExtEventList(history);
                }}><img src={AccessBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToExtEventList(history);
                }}>第三方接入面板</a>。</p>
                <p>目前只支持国内的gitlab(jihulab)和gitee。</p>
                <p>注意: 必须对代码仓库上的用户和项目用户进行关联后，相关事件才会在<a>工作记录面板</a>出现。</p>
            </>),
            enable: projectStore.isAdmin && projectStore.curProject?.setting.disable_server_agent === false,
        },
        {
            title: "使用频道减少沟通干扰",
            content: (<>
                <p>在讨论工作的时候，我们可以一事一议。我们可以创建<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, projectStore.curProject?.default_channel_id ?? ""), history);
                }}>频道</a>进行沟通，等沟通完成后关闭频道。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false,
        },
        {
            title: "使用工作计划安排工作",
            content: (<>
                <p><a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    spritStore.setCurSpritId("");
                    history.push(APP_PROJECT_WORK_PLAN_PATH);
                }}>工作计划</a>可以关联任务/缺陷，文档和沟通频道。可以作为项目管理的入口。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_work_plan === false,
        },
        {
            title: "使用桌面便签",
            content: (<>
                <p>为了更专注的进行工作，你可以把相关<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToTaskList(undefined, history);
                }}>任务</a>/<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToBugList(undefined, history);
                }}>缺陷</a>已便签的方式放在桌面。</p>
                <p>你可以点击列表中的<ExportOutlined style={{ fontSize: "20px" }} />按钮打开桌面便签。</p>
            </>),
            enable: true,
        },
        {
            title: "快速了解同事工作",
            content: (<>
                <p>你可以进入<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(APP_PROJECT_WORK_PLAN_PATH);
                }}>项目概览</a>，点击具体成员，可以获取成员的统计信息。</p>
                <p>你也可以通过右侧工具栏上的<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}><img src={RecordBtn} /></a>来打开<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToEventList(history);
                }}>工作记录面板</a>, 来了解同事的工作情况。</p>
            </>),
            enable: true,
        },
        {
            title: "使用githooks加快任务状态变更",
            content: (<>
                <p>我们可以利用git的POST_COMMIT hook，在每次commit后，提示用户修改任务/缺陷状态。</p>
                <p>你可以通过<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    projectStore.projectTool = PROJECT_TOOL_TYPE.PROJECT_TOOL_GIT_HOOk;
                }}>设置GitHooks</a>来修改git仓库的hook。</p>
            </>),
            enable: true,
        },
        {
            title: "引导同事掌握更全面的知识",
            content: (<>
                <p>你可以在<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(APP_PROJECT_KB_BOOK_SHELF_PATH);
                }}>项目书籍</a>中，添加需要同事阅读的书籍，然后在沟通中引用部分内容，引导同事阅读相关内容。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false && projectStore.curProject?.setting.disable_kb === false,
        },
        {
            title: "在vscode里面获取项目信息",
            content: (<>
                <p>你可以在vscode中安装<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    open("https://marketplace.visualstudio.com/items?itemName=linksaas.local-api");
                }}>插件</a>，从而在vscode中获取项目相关的任务/缺陷，文档信息。</p>
            </>),
            enable: true,
        },
        {
            title: "快捷发布html资源",
            content: (<>
                <p>你可以把微应用当作项目的Pages服务，你可以把产品设计工具，代码工具生成的html上传到<a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToAppList(history);
                }}>项目应用市场</a>。</p>
            </>),
            enable: projectStore.isAdmin && projectStore.curProject?.setting.disable_app_store === false,
        },
        {
            title: "快捷创建需求",
            content: (<>
                <p>当你在沟通频道时，悬浮在消息上方时，可通过<img src={ReqQuickBtn} />按钮快捷创建需求。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false,
        },
        {
            title: "快捷创建任务/缺陷",
            content: (<>
                <p>当你在沟通频道时，悬浮在消息上方时，可通过<img src={TaskQuickBtn} />或<img src={BugQuickBtn} />按钮快捷创建任务/缺陷。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false,
        },
        {
            title: "快捷创建知识点",
            content: (<>
                <p>当你在沟通频道时，悬浮在消息上方时，可通过<img src={IdeaQuickBtn} />按钮快捷创建知识点。</p>
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false,
        },
        {
            title: "利用关注功能创建快捷入口",
            content: (<>
                {projectStore.curProject?.setting.disable_chat === false && (
                    <p>你可以在<a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkChannelInfo("", projectStore.curProjectId, projectStore.curProject?.default_channel_id ?? ""), history);
                    }}>频道列表</a>左侧的<img src={NoCollectBtn} />或<img src={CollectBtn} />来关注频道，关注后在项目列表中会出现快捷入口。</p>
                )}
                {projectStore.curProject?.setting.disable_kb === false && (
                    <p>你可以在<a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        history.push(APP_PROJECT_KB_DOC_PATH);
                        if (appStore.simpleMode) {
                            appStore.simpleMode = false;
                        }
                        docSpaceStore.showDocList("", false);
                    }}>文档列表</a>左侧的<img src={NoCollectBtn} />或<img src={CollectBtn} />来关注文档，关注后在项目列表中会出现快捷入口。</p>
                )}
                {projectStore.curProject?.setting.disable_work_plan === false && (
                    <p>你可以在<a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        spritStore.setCurSpritId("");
                        history.push(APP_PROJECT_WORK_PLAN_PATH);
                    }}>工作计划列表</a>左侧的<img src={NoCollectBtn} />或<img src={CollectBtn} />来关注工作计划，关注后在项目列表中会出现快捷入口。</p>
                )}
            </>),
            enable: projectStore.curProject?.setting.disable_chat === false || projectStore.curProject?.setting.disable_kb == false || projectStore.curProject?.setting.disable_work_plan == false,
        }
    ];

    useEffect(() => {
        setTipList(allTipList.filter(item => item.enable));
        setCurTipIndex(0);
    }, [projectStore.isAdmin, projectStore.curProject?.setting, projectStore.curProjectId]);

    return (
        <>
            {tipList.length > 0 && curTipIndex < tipList.length && (
                <Popover trigger="click" placement="bottom" content={
                    <Card title={tipList[curTipIndex].title} style={{ width: "400px" }}
                        headStyle={{ paddingLeft: "20px", fontSize: "16px", fontWeight: 600 }}
                        bodyStyle={{ padding: "10px 20px" }}
                        extra={
                            <Space>
                                <Button type="link" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    let n = curTipIndex - 1;
                                    if (n < 0) {
                                        n = tipList.length - 1;
                                    }
                                    if (n < 0) {
                                        n = 0;
                                    }
                                    setCurTipIndex(n);
                                }}>上一条</Button>
                                <Button type="link" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    let n = curTipIndex + 1;
                                    if (n >= tipList.length) {
                                        n = 0;
                                    }
                                    setCurTipIndex(n);
                                }}>下一条</Button>
                            </Space>
                        }>
                        {tipList[curTipIndex].content}
                    </Card>
                } onOpenChange={visible => {
                    if (!visible) {
                        const n = (Math.random() * tipList.length);
                        setCurTipIndex(Math.floor(n));
                    }
                }}>
                    <AlertTwoTone twoToneColor={["orange", "white"]} title="使用技巧" style={{ marginRight: "20px" }} />
                </Popover>
            )}
        </>

    );
};

export default observer(ProjectUseTip);