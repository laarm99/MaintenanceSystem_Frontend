import {
  AppstoreOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DesktopOutlined,
  ToolOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export const getModuleItems = (t) => [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">{t("menu.dashboard")}</Link>,
  },
  {
    key: "/equipment",
    icon: <DesktopOutlined />,
    label: <Link to="/equipment">{t("menu.equipment")}</Link>,
  },
  {
    key: "/calendar",
    icon: <CalendarOutlined />,
    label: <Link to="/calendar">{t("menu.calendar")}</Link>,
  },
  {
    key: "/maintenance",
    icon: <ToolOutlined />,
    label: <Link to="/maintenance">{t("menu.maintenance")}</Link>,
  },
  {
    key: "/catalogs",
    icon: <AppstoreOutlined />,
    label: <Link to="/catalogs">{t("menu.catalogs")}</Link>,
  },
  {
    key: "/imports",
    icon: <UploadOutlined />,
    label: <Link to="/imports">{t("menu.imports")}</Link>,
  },
];
