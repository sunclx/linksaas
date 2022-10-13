import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/global.less';
import randomColor from 'randomcolor';
import { CloseSquareOutlined, FormatPainterOutlined } from '@ant-design/icons/lib/icons';
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { SHORT_NOTE_TYPE } from '@/utils/short_note';
import type { ShortNoteEvent } from '@/utils/short_note';
import { useLocation } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';




const Content = () => {
    const [bgColor, setBgColor] = useState("");

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const shortNoteType = urlParams.get("type");
    const projectId = urlParams.get("projectId");
    const projectName = urlParams.get("projectName");
    const id = urlParams.get("id");
    const title = urlParams.get("title");


    const randomBgColor = () => {
        const color = randomColor({ luminosity: "light" });
        setBgColor(color);
    };

    const getShortNoteType = () => {
        if (shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_TASK) {
            return "任务";
        } else if (shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_BUG) {
            return "缺陷";
        } else if (shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_DOC) {
            return "文档";
        }
        return "";
    };

    const showDetail = () => {
        const ev: ShortNoteEvent = {
            projectId: projectId ?? "",
            shortNoteType: shortNoteType ?? "",
            targetId: id ?? "",
        };
        const mainWindow = WebviewWindow.getByLabel("main");
        mainWindow?.emit("shortNote", ev);
    };

    useMemo(() => {
        randomBgColor();
    }, []);

    return (
        <div style={{
            backgroundColor: bgColor,
            width: "100wh",
            height: "100vh",
            overflowY: "scroll",
        }} data-tauri-drag-region={true}>
            <div style={{ position: "relative", height: "30px", paddingTop: "10px" }} data-tauri-drag-region={true}>
                <div style={{ position: "absolute", right: "0px" }}>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        randomBgColor();
                    }}><FormatPainterOutlined style={{ fontSize: "24px", color: "black" }} /></a>
                    <a style={{ marginLeft: "20px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        appWindow.close();
                    }}><CloseSquareOutlined style={{ fontSize: "24px", color: "black" }} /></a>
                </div>
            </div>
            <div style={{ paddingLeft: "20px" }} data-tauri-drag-region={true}>
                <div data-tauri-drag-region={true}>项目:{projectName}</div>
                <div data-tauri-drag-region={true}>
                    {getShortNoteType()}:{title}&nbsp;&nbsp;
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        showDetail();
                    }}>查看详情</a>
                </div>
            </div>
        </div>
    );
}


const App = () => {
    return (
        <BrowserRouter><Content /></BrowserRouter>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);