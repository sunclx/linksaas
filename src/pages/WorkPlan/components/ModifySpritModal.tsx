import { Form, Modal, Input, DatePicker, Tag, message, Radio, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './ModifySpritModal.module.less';
import type { Moment } from 'moment';
import moment from 'moment';
import { type ISSUE_LIST_TYPE, ISSUE_LIST_ALL, ISSUE_LIST_LIST, ISSUE_LIST_KANBAN } from '@/api/project_sprit';
import { create as create_sprit, update as update_sprit, get as get_sprit } from '@/api/project_sprit';
import { request } from '@/utils/request';
import { useStores } from "@/hooks";

interface CreateSpritModalProps {
    onCancel: () => void;
    onOk: () => void;
    spritId?: string;
}

interface FormValue {
    title: string | undefined;
    dateRange: Moment[] | undefined;
    issueListType: ISSUE_LIST_TYPE;
    hideDocPanel: boolean;
    hideGanttPanel: boolean;
    hideBurndownPanel: boolean;
    hideStatPanel: boolean;
    hideSummaryPanel: boolean;
}

const CreateSpritModal: React.FC<CreateSpritModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [form] = Form.useForm();

    const [nowWorkDayList, setNowWorkDayList] = useState<number[]>([]);
    const [dateRangeOk, setDateRangeOk] = useState(false);

    const getDayTime = (m: Moment): number => {
        const day = Math.round(m.valueOf() / (1000 * 3600 * 24));
        return day * 1000 * 3600 * 24;
    };

    const checkDayValid = (day: Moment): boolean => {
        const formValue = form.getFieldsValue() as FormValue;
        if (formValue.dateRange == undefined) {
            return false;
        }
        const startTime = formValue.dateRange[0].valueOf();
        const endTime = formValue.dateRange[1].valueOf();
        const dayTime = getDayTime(day);
        return dayTime >= startTime && dayTime <= endTime;
    };

    const createSprit = async () => {
        const formValue = form.getFieldsValue() as FormValue;
        if (formValue.title == undefined || formValue.title.trim() == "") {
            message.error("工作计划名称不能为空");
            return;
        }
        if (formValue.dateRange == undefined) {
            message.error("请设置工作计划时间区间");
            return;
        }
        await request(create_sprit(userStore.sessionId, projectStore.curProjectId, {
            title: formValue.title.trim(),
            start_time: getDayTime(formValue.dateRange[0]),
            end_time: getDayTime(formValue.dateRange[1]),
            non_work_day_list: nowWorkDayList,
            issue_list_type: formValue.issueListType,
            hide_doc_panel: formValue.hideDocPanel,
            hide_gantt_panel: formValue.hideGanttPanel,
            hide_burndown_panel: formValue.hideBurndownPanel,
            hide_stat_panel: formValue.hideStatPanel,
            hide_summary_panel: formValue.hideSummaryPanel,
        }));
        props.onOk();
    };

    const updateSprit = async () => {
        const formValue = form.getFieldsValue() as FormValue;
        if (formValue.title == undefined || formValue.title.trim() == "") {
            message.error("工作计划名称不能为空");
            return;
        }
        if (formValue.dateRange == undefined) {
            message.error("请设置工作计划时间区间");
            return;
        }
        await request(update_sprit(userStore.sessionId, projectStore.curProjectId,
            props.spritId ?? "",
            {
                title: formValue.title.trim(),
                start_time: getDayTime(formValue.dateRange[0]),
                end_time: getDayTime(formValue.dateRange[1]),
                non_work_day_list: nowWorkDayList,
                issue_list_type: formValue.issueListType,
                hide_doc_panel: formValue.hideDocPanel,
                hide_gantt_panel: formValue.hideGanttPanel,
                hide_burndown_panel: formValue.hideBurndownPanel,
                hide_stat_panel: formValue.hideStatPanel,
                hide_summary_panel: formValue.hideSummaryPanel,
            }));
        props.onOk();
    };


    const loadSprit = async () => {
        if (props.spritId == undefined) {
            return;
        }
        const res = await request(get_sprit(userStore.sessionId, projectStore.curProjectId, props.spritId ?? ""));
        const formValue: FormValue = {
            title: res.info.basic_info.title,
            dateRange: [moment(res.info.basic_info.start_time), moment(res.info.basic_info.end_time)],
            issueListType: res.info.basic_info.issue_list_type,
            hideDocPanel: res.info.basic_info.hide_doc_panel,
            hideGanttPanel: res.info.basic_info.hide_gantt_panel,
            hideBurndownPanel: res.info.basic_info.hide_burndown_panel,
            hideStatPanel: res.info.basic_info.hide_stat_panel,
            hideSummaryPanel: res.info.basic_info.hide_summary_panel,
        }
        form.setFieldsValue(formValue);
        setDateRangeOk(true);
    };

    useEffect(() => {
        if (props.spritId != undefined) {
            loadSprit();
        } else {
            form.setFieldsValue({
                title: "",
                dateRange: undefined,
                issueListType: ISSUE_LIST_ALL,
                hideDocPanel: false,
                hideGanttPanel: false,
                hideBurndownPanel: false,
                hideStatPanel: false,
                hideSummaryPanel: false,
                hideChannel: false,
            });
        }
    }, []);

    return (
        <Modal
            title={`${props.spritId == undefined ? "创建" : "修改"}工作计划`}
            open
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.spritId == undefined) {
                    createSprit();
                } else {
                    updateSprit();
                }
            }}>
            <Form form={form} labelCol={{ span: 5 }}>
                <Form.Item name="title" label="工作计划名称" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dateRange" label="时间区间" rules={[{ required: true }]}>
                    <DatePicker.RangePicker popupClassName={s.date_picker} onChange={() => setDateRangeOk(true)} />
                </Form.Item>
                <Form.Item label="非工作日">
                    {nowWorkDayList.map(dayTime => (
                        <Tag key={dayTime} style={{ lineHeight: "26px", marginTop: "2px" }}
                            closable onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = nowWorkDayList.filter(item => item != dayTime);
                                setNowWorkDayList(tmpList);
                            }}>
                            {moment(dayTime).format("YYYY-MM-DD")}
                        </Tag>
                    ))}
                    <DatePicker popupClassName={s.date_picker} value={null} disabled={dateRangeOk == false}
                        disabledDate={(day) => checkDayValid(day) == false}
                        onChange={value => {
                            if (value !== null) {
                                if (checkDayValid(value) == false) {
                                    return;
                                }
                                const dayTime = getDayTime(value);
                                if (nowWorkDayList.includes(dayTime) == false) {
                                    const tmpList = nowWorkDayList.slice();
                                    tmpList.push(dayTime);
                                    tmpList.sort();
                                    setNowWorkDayList(tmpList);
                                }
                            }
                        }} />
                </Form.Item>
                <Form.Item name="issueListType" label="列表样式">
                    <Radio.Group>
                        <Radio value={ISSUE_LIST_ALL}>列表和看板</Radio>
                        <Radio value={ISSUE_LIST_LIST}>列表</Radio>
                        <Radio value={ISSUE_LIST_KANBAN}>看板</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="hideDocPanel" label="隐藏相关文档" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item name="hideGanttPanel" label="隐藏甘特图" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item name="hideBurndownPanel" label="隐藏燃尽图" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item name="hideStatPanel" label="隐藏统计信息" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item name="hideSummaryPanel" label="隐藏工作总结" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item name="hideChannel" label="隐藏关联频道" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreateSpritModal);
