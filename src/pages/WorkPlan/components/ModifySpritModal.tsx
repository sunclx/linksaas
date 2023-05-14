import { Form, Modal, Input, DatePicker, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './ModifySpritModal.module.less';
import type { Moment } from 'moment';
import moment from 'moment';
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
            message.error("迭代名称不能为空");
            return;
        }
        if (formValue.dateRange == undefined) {
            message.error("请设置迭代时间区间");
            return;
        }
        await request(create_sprit(userStore.sessionId, projectStore.curProjectId, {
            title: formValue.title.trim(),
            start_time: getDayTime(formValue.dateRange[0]),
            end_time: getDayTime(formValue.dateRange[1]),
            non_work_day_list: nowWorkDayList,
        }));
        props.onOk();
    };

    const updateSprit = async () => {
        const formValue = form.getFieldsValue() as FormValue;
        if (formValue.title == undefined || formValue.title.trim() == "") {
            message.error("迭代名称不能为空");
            return;
        }
        if (formValue.dateRange == undefined) {
            message.error("请设置迭代时间区间");
            return;
        }
        await request(update_sprit(userStore.sessionId, projectStore.curProjectId,
            props.spritId ?? "",
            {
                title: formValue.title.trim(),
                start_time: getDayTime(formValue.dateRange[0]),
                end_time: getDayTime(formValue.dateRange[1]),
                non_work_day_list: nowWorkDayList,
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
            dateRange: [moment(res.info.basic_info.start_time), moment(res.info.basic_info.end_time)]
        }
        form.setFieldsValue(formValue);
        setDateRangeOk(true);
        setNowWorkDayList(res.info.basic_info.non_work_day_list);
    };

    useEffect(() => {
        if (props.spritId != undefined) {
            loadSprit();
        }
    }, []);

    return (
        <Modal
            title={`${props.spritId == undefined?"创建":"修改"}迭代`}
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
            <Form form={form} labelCol={{ span: 4 }}>
                <Form.Item name="title" label="迭代名称" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dateRange" label="时间区间" rules={[{ required: true }]}>
                    <DatePicker.RangePicker popupClassName={s.date_picker} onChange={() => setDateRangeOk(true)} />
                </Form.Item>
                <Form.Item label="非工作日">
                    {nowWorkDayList.map(dayTime => (
                        <Tag key={dayTime} closable onClose={e => {
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
            </Form>
        </Modal>
    );
};

export default observer(CreateSpritModal);
