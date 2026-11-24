import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export default function ActiveTag({ value }) {
    const { t } = useTranslation();
    return <Tag color={value ? "green" : "default"}>{value ? t("crud.active") : t("crud.inactive")}</Tag>;
}