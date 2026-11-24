import { useCallback, useMemo, useState } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import EnumTag from "../../../components/common/EnumTag";
import useRemoteList from "../../../hooks/useRemoteList";
import { getEnumOptions, NonWorkingDayType } from "../../../constants/enums";
import { toOptions } from "../../../utils/options";
import { nonWorkingDaysApi, plantsApi, sitesApi } from "../api/catalogsApi";

const DATE_FORMAT = "YYYY-MM-DD";

function NonWorkingDayFields({ form, sites, plants, editing }) {
    const { t } = useTranslation();
    const siteId = Form.useWatch("siteId", form);

    return (
        <>
            <Form.Item name="siteId" label={t("fields.site")} rules={[{ required: true }]}>
                <Select
                    options={toOptions(sites, (x) => `${x.code} - ${x.name}`, editing?.siteId)}
                    onChange={() => form.setFieldValue("plantId", undefined)}
                />
            </Form.Item>
            <Form.Item name="plantId" label={t("fields.plant")} extra={t("fields.allPlantsHint")}>
                <Select
                    allowClear
                    placeholder={t("fields.allPlants")}
                    options={toOptions(
                        plants.filter((x) => x.siteId === siteId),
                        (x) => `${x.code} - ${x.name}`,
                        editing?.plantId,
                    )}
                />
            </Form.Item>
            <Form.Item name="date" label={t("fields.date")} rules={[{ required: true }]}>
                <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label={t("fields.description")} rules={[{ required: true }, { max: 200 }]}>
                <Input />
            </Form.Item>
            <Form.Item name="type" label={t("fields.type")} rules={[{ required: true }]}>
                <Select options={getEnumOptions(NonWorkingDayType, "NonWorkingDayType", t)} />
            </Form.Item>
        </>
    );
}

export default function NonWorkingDaysTab({ onChanged }) {
    const { t } = useTranslation();
    const { data: sites } = useRemoteList(sitesApi.list);
    const { data: plants } = useRemoteList(plantsApi.list);
    const currentYear = dayjs().year();
    const [year, setYear] = useState(currentYear);

    const yearOptions = useMemo(
        () => [currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((y) => ({ value: y, label: y })),
        [currentYear],
    );

    const filterRecords = useCallback(
        (records) => (year ? records.filter((x) => x.date.startsWith(String(year))) : records),
        [year],
    );

    const columns = [
        {
            title: t("fields.date"),
            dataIndex: "date",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a.date.localeCompare(b.date),
            render: (v) => dayjs(v).format("DD/MM/YYYY ddd"),
        },
        { title: t("fields.site"), dataIndex: "siteCode" },
        { title: t("fields.plant"), dataIndex: "plantCode", render: (v) => v ?? t("fields.allPlants") },
        { title: t("fields.description"), dataIndex: "description" },
        { title: t("fields.type"), dataIndex: "type", render: (v) => <EnumTag enumName="NonWorkingDayType" value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.nonWorkingDays")}
            api={nonWorkingDaysApi}
            columns={columns}
            onChanged={onChanged}
            getSearchText={(x) => `${x.date} ${x.siteCode} ${x.plantCode ?? ""} ${x.description}`}
            filterRecords={filterRecords}
            toolbar={
                <Select
                    allowClear
                    placeholder={t("fields.year")}
                    style={{ width: 120 }}
                    value={year}
                    onChange={setYear}
                    options={yearOptions}
                />
            }
            newValues={{ type: NonWorkingDayType.Holiday, siteId: sites.length === 1 ? sites[0].id : undefined }}
            toFormValues={(x) => ({ ...x, date: dayjs(x.date) })}
            toRequest={(values) => ({
                ...values,
                plantId: values.plantId ?? null,
                date: values.date.format(DATE_FORMAT),
            })}
            renderForm={({ form, editing }) => (
                <NonWorkingDayFields form={form} sites={sites} plants={plants} editing={editing} />
            )}
        />
    );
}