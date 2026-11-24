import { Card, Empty } from "antd";
import { useTranslation } from "react-i18next";

export default function ModulePlaceholder({ titleKey }) {
    const { t } = useTranslation();

    return (
        <Card title={t(titleKey)}>
            <Empty description={t("common.underConstruction")} />
        </Card>
    );
}
