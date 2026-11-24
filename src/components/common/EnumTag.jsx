import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export default function EnumTag({ enumName, value, colors }) {
    const { t } = useTranslation();

    if (!value) return null;

    return (
        <Tag color={colors?.[value] ?? "default"}>
            {t(`enums.${enumName}.${value}`)}
        </Tag>
    );
}
