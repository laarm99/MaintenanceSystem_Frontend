import { Form, Input, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import ActiveTag from "../../../components/common/ActiveTag";
import EnumTag from "../../../components/common/EnumTag";
import { getEnumOptions, MaintenanceFrequency } from "../../../constants/enums";
import { equipmentTypesApi } from "../api/catalogsApi";

const toUpper = (value) => value?.toUpperCase();

export default function EquipmentTypesTab({ onChanged }) {
    const { t } = useTranslation();

    const columns = [
        { title: t("fields.code"), dataIndex: "code", sorter: (a, b) => a.code.localeCompare(b.code) },
        { title: t("fields.name"), dataIndex: "name" },
        {
            title: t("fields.defaultFrequency"),
            dataIndex: "defaultFrequency",
            render: (v) => <EnumTag enumName="MaintenanceFrequency" value={v} />,
        },
        { title: t("fields.isActive"), dataIndex: "isActive", render: (v) => <ActiveTag value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.equipmentTypes")}
            api={equipmentTypesApi}
            columns={columns}
            onChanged={onChanged}
            getSearchText={(x) => `${x.code} ${x.name}`}
            newValues={{ isActive: true }}
            toRequest={(values) => ({ ...values, defaultFrequency: values.defaultFrequency ?? null })}
            renderForm={() => (
                <>
                    <Form.Item name="code" label={t("fields.code")} normalize={toUpper} rules={[{ required: true }, { max: 20 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label={t("fields.name")} rules={[{ required: true }, { max: 100 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="defaultFrequency" label={t("fields.defaultFrequency")}>
                        <Select allowClear options={getEnumOptions(MaintenanceFrequency, "MaintenanceFrequency", t)} />
                    </Form.Item>
                    <Form.Item name="isActive" label={t("fields.isActive")} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </>
            )}
        />
    );
}