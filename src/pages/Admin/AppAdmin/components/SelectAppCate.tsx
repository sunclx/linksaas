import { request } from "@/utils/request";
import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import { list_major_cate, list_minor_cate, list_sub_minor_cate } from '@/api/appstore';
import type { MajorCate, MinorCate, SubMinorCate } from '@/api/appstore';

interface SelectAppCateProps {
    onChange: (majorCateId: string, minorCateId: string, subMinorCateId: string) => void;
}

const SelectAppCate: React.FC<SelectAppCateProps> = (props) => {

    const [majorCateList, setMajorCateList] = useState<MajorCate[]>([]);
    const [minorCateList, setMinorCateList] = useState<MinorCate[]>([]);
    const [subMinorCateList, setSubMinorCateList] = useState<SubMinorCate[]>([]);

    const [curMajorCateId, setCurMajorCateId] = useState<string | null>(null);
    const [curMinorCateId, setCurMinorCateId] = useState<string | null>(null);
    const [curSubMinorCateId, setSubCurMinorCateId] = useState<string | null>(null);

    const loadMajorCateList = async () => {
        const res = await request(list_major_cate({}));
        setMajorCateList(res.cate_info_list);
    };

    const loadMinorCateList = async () => {
        if (curMajorCateId == null) {
            setMinorCateList([]);
            setCurMinorCateId(null);
        } else {
            const res = await request(list_minor_cate({
                major_cate_id: curMajorCateId,
            }));
            setMinorCateList(res.cate_info_list);
        }
    };

    const loadSubMinorCateList = async () => {
        if (curMinorCateId == null) {
            setSubMinorCateList([]);
        } else {
            const res = await request(list_sub_minor_cate({
                minor_cate_id: curMinorCateId,
            }));
            setSubMinorCateList(res.cate_info_list);
        }
    };

    useEffect(() => {
        loadMajorCateList();
    }, []);

    useEffect(() => {
        loadMinorCateList();
    }, [curMajorCateId]);

    useEffect(() => {
        loadSubMinorCateList();
    }, [curMinorCateId]);

    return (
        <Form layout="inline">
            <Form.Item label="一级分类">
                <Select style={{ width: 100 }} value={curMajorCateId} onChange={value => {
                    setCurMajorCateId(value);
                    props.onChange(value ?? "", "", "");
                }}>
                    <Select.Option value={null}>全部</Select.Option>
                    {majorCateList.map(item => (
                        <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="二级分类">
                <Select style={{ width: 100 }} value={curMinorCateId} onChange={value => {
                    setCurMinorCateId(value);
                    props.onChange(curMajorCateId ?? "", value ?? "", "");
                }}>
                    <Select.Option value={null}>全部</Select.Option>
                    {minorCateList.map(item => (
                        <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="三级分类">
                <Select style={{ width: 100 }} value={curSubMinorCateId} onChange={value => {
                    setSubCurMinorCateId(value);
                    props.onChange(curMajorCateId ?? "", curMinorCateId ?? "", value ?? "");
                }}>
                    <Select.Option value={null}>全部</Select.Option>
                    {subMinorCateList.map(item => (
                        <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default SelectAppCate;