import { useCallback, useState } from "react";
import { Form, Input, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import ActiveTag from "../../../components/common/ActiveTag";
import useRemoteList from "../../../hooks/useRemoteList";
import { filterOption, toOptions } from "../../../utils/options";
import { sitesApi, plantsApi } from "../api/catalogsApi";

const toUpper = (value) => value?.toUpperCase();

export default function PlantsTab({ onChanged }) {
    const { t } = useTranslation();
    const { data: sites } = useRemoteList(sitesApi.list);
    const [siteFilter, setSiteFilter] = useState(null);

    const filterRecords = useCallback(
        (records) => (siteFilter ? records.filter((x) => x.siteId === siteFilter) : records),
        [siteFilter],
    );

    const siteLabel = (x) => `${x.code} - ${x.name}`;

    const columns = [
        { title: t("fields.site"), dataIndex: "siteCode" },
        { title: t("fields.code"), dataIndex: "code", sorter: (a, b) => a.code.localeCompare(b.code) },
        { title: t("fields.name"), dataIndex: "name" },
        { title: t("fields.isActive"), dataIndex: "isActive", render: (v) => <ActiveTag value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.plants")}
            api={plantsApi}
            columns={columns}
            onChanged={onChanged}
            getSearchText={(x) => `${x.siteCode} ${x.code} ${x.name}`}
            filterRecords={filterRecords}
            toolbar={
                <Select
                    allowClear
                    placeholder={t("fields.site")}
                    style={{ width: 220 }}
                    value={siteFilter}
                    onChange={setSiteFilter}
                    options={toOptions(sites, siteLabel)}
                />
            }
            newValues={{ isActive: true, siteId: sites.length === 1 ? sites[0].id : undefined }}
            renderForm={({ editing }) => (
                <>
                    <Form.Item name="siteId" label={t("fields.site")} rules={[{ required: true }]}>
                        <Select showSearch filterOption={filterOption} options={toOptions(sites, siteLabel, editing?.siteId)} />
                    </Form.Item>
                    <Form.Item name="code" label={t("fields.code")} normalize={toUpper} rules={[{ required: true }, { max: 20 }]}>
                        <Input />
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