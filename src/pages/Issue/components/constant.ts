import type { EditSelectItem } from "../../../components/EditCell/EditSelect";
import * as issueApi from '@/api/project_issue';


export const bugLvSelectItems: EditSelectItem[] = [
    {
        value: issueApi.BUG_LEVEL_MINOR,
        label: '提示',
        color: '#06C776',
    },
    {
        value: issueApi.BUG_LEVEL_MAJOR,
        label: '一般',
        color: '#F99B00',
    },
    {
        value: issueApi.BUG_LEVEL_CRITICAL,
        label: '严重',
        color: '#FB6D17',
    },
    {
        value: issueApi.BUG_LEVEL_BLOCKER,
        label: '致命',
        color: '#DF0627',
    }
];

export const taskPrioritySelectItems: EditSelectItem[] = [
    {
        value: issueApi.TASK_PRIORITY_LOW,
        label: '低',
        color: '#38CB80',
    },
    {
        value: issueApi.TASK_PRIORITY_MIDDLE,
        label: '中',
        color: '#FF8963',
    },
    {
        value: issueApi.TASK_PRIORITY_HIGH,
        label: '高',
        color: '#FF4C30',
    },
];

export const bugPrioritySelectItems: EditSelectItem[] = [
    {
        label: '低优先级',
        value: issueApi.BUG_PRIORITY_LOW,
        color: '#1D85F8',
    },
    {
        label: '正常处理',
        value: issueApi.BUG_PRIORITY_NORMAL,
        color: '#06C776',
    },
    {
        label: '高度重视',
        value: issueApi.BUG_PRIORITY_HIGH,
        color: '#F99B00',
    },
    {
        label: '急需解决',
        value: issueApi.BUG_PRIORITY_URGENT,
        color: '#FB6D17',
    },
    {
        label: '马上解决',
        value: issueApi.BUG_PRIORITY_IMMEDIATE,
        color: '#DF0627',
    }
];

export const hourSelectItems: EditSelectItem[] =
    [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
        8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16].map(hour => {
            return {
                value: Math.ceil(hour * 60),
                label: `${hour}`,
                color: '#000'
            };
        });