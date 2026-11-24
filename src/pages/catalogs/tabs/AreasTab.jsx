import { useCallback, useState } from "react";
import { Form, Input, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import ActiveTag from "../../../components/common/ActiveTag";
import useRemoteList from "../../../hooks/useRemoteList";
import { filterOption, toOptions } from "../../../utils/options";
import { areasApi, plantsApi } from "../api/catalogsApi";

export default function AreasTab({ onChanged }) {
    const { t } = useTranslation();
    const { data: plants } = useRemoteList(plantsApi.list);
    const [plantFilter, setPlantFilter] = useState(null);

    const filterRecords = useCallback(
        (records) => (plantFilter ? records.filter((x) => x.plantId === plantFilter) : records),
        [plantFilter],
    );

    const plantLabel = (x) => `${x.siteCode} / ${x.code} - ${x.name}`;

    const columns = [
        { title: t("fields.site"), dataIndex: "siteCode" },
        { title: t("fields.plant"), dataIndex: "plantCode", render: (_, x) => `${x.plantCode} - ${x.plantName}` },
        { title: t("fields.name"), dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: t("fields.isActive"), dataIndex: "isActive", render: (v) => <ActiveTag value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.areas")}
            api={areasApi}
            columns={columns}
            onChanged={onChanged}
            getSearchText={(x) => `${x.siteCode} ${x.plantCode} ${x.plantName} ${x.name}`}
            filterRecords={filterRecords}
            toolbar={
                <Select
                    allowClear
                    showSearch
                    filterOption={filterOption}
                    placeholder={t("fields.plant")}
                    style={{ width: 260 }}
                    value={plantFilter}
                    onChange={setPlantFilter}
                    options={toOptions(plants, plantLabel)}
                />
            }
            newValues={{ isActive: true, plantId: plantFilter ?? undefined }}
            renderForm={({ editing }) => (
                <>
                    <Form.Item name="plantId" label={t("fields.plant")} rules={[{ required: true }]}>
                        <Select showSearch filterOption={filterOption} options={toOptions(plants, plantLabel, editing?.plantId)} />
                    </Form.Item>
                    <Form.Item name="name" label={t("fields.name")} rules={[{ required: true }, { max: 100 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="isActive" label={t("fields.isActive")} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </>
            )}
        />
    );
}