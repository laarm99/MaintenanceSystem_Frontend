import { Form, Input, Switch } from "antd";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import ActiveTag from "../../../components/common/ActiveTag";
import { sitesApi } from "../api/catalogsApi";

const DEFAULT_TIME_ZONE = "America/Ciudad_Juarez";
const toUpper = (value) => value?.toUpperCase();

export default function SitesTab({ onChanged }) {
    const { t } = useTranslation();

    const columns = [
        { title: t("fields.code"), dataIndex: "code", sorter: (a, b) => a.code.localeCompare(b.code) },
        { title: t("fields.name"), dataIndex: "name" },
        { title: t("fields.timeZone"), dataIndex: "timeZone" },
        { title: t("fields.isActive"), dataIndex: "isActive", render: (v) => <ActiveTag value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.sites")}
            api={sitesApi}
            columns={columns}
            onChanged={onChanged}
            getSearchText={(x) => `${x.code} ${x.name}`}
            newValues={{ isActive: true, timeZone: DEFAULT_TIME_ZONE }}
            renderForm={() => (
                <>
                    <Form.Item name="code" label={t("fields.code")} normalize={toUpper} rules={[{ required: true }, { max: 20 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label={t("fields.name")} rules={[{ required: true }, { max: 100 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="timeZone" label={t("fields.timeZone")} rules={[{ max: 100 }]}>
                        <Input placeholder={DEFAULT_TIME_ZONE} />
                    </Form.Item>
                    <Form.Item name="isActive" label={t("fields.isActive")} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </>
            )}
        />
    );
}