import { CloseSquareOutlined } from '@ant-design/icons/lib/icons';
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/global.less';
import logoPng from '@/assets/allIcon/logo.png';
import { appWindow } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';


const App = () => {
    const [version, setVersion] = useState("");

    useMemo(() => {
        getVersion().then(ver => setVersion(ver));
    }, []);
    return (
        <div style={{ backgroundColor: "#fff", height: "140px" }}>
            <div style={{ position: "relative", backgroundColor: "#ddd", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "3px", cursor: "move" }}
                onMouseDown={e => {
                    if ((e.target as HTMLDivElement).hasAttribute("data-drag")) {
                        e.preventDefault();
                        e.stopPropagation();
                        appWindow.startDragging();
                    }
                }} onTouchStart={e => {
                    if ((e.target as HTMLDivElement).hasAttribute("data-drag")) {
                        e.preventDefault();
                        e.stopPropagation();
                        appWindow.startDragging();
                    }
                }} data-drag>
                <span style={{
                    fontSize: "16px",
                    fontWeight: 500,
                }}>关于</span>
                <a style={{
                    position: "absolute",
                    right: "10px"
                }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    appWindow.close();
                }}><CloseSquareOutlined /></a>
            </div>
            <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <img src={logoPng} width="24px" /><span style={{ paddingLeft: "10px", fontSize: "16px" }}>凌鲨</span>
                <div style={{ marginTop: "10px" }}>
                    <div>
                        <div>版本：{version}&nbsp;&nbsp;</div>
                    </div>
                    <div>
                        <div>公司：深圳市同心圆网络有限公司</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const root = createRoot(document.getElementById('root')!);
root.render(<App />);