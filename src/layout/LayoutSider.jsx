import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import style from "../layout/styles/LayoutSider.module.css"

export default function LayoutSider({ moduleItems }) {
    const [collapsed, setCollapsed] = useState(true);
    const { pathname } = useLocation();
    const selectedKey = moduleItems.find((item) => pathname.startsWith(item.key))?.key;

    return (
        <>
            <Sider
                className={style.siderStyle}
                trigger={null}
                collapsible
                collapsed={collapsed}
                collapsedWidth={70}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >
                <div className="demo-logo-vertical">
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectedKey ? [selectedKey] : []}
                        items={moduleItems}
                    />
                </div>
            </Sider>
        </>
    )
}
