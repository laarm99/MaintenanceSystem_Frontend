import { useCallback, useState } from "react";
import { Col, Form, Input, Row, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import CrudTable from "../../components/common/CrudTable";
import EnumTag from "../../components/common/EnumTag";
import useRemoteList from "../../hooks/useRemoteList";
import {
    CriticalityLevel,
    CriticalityLevelColor,
    EquipmentStatus,
    EquipmentStatusColor,
    getEnumOptions,
    MaintenanceFrequency,
} from "../../constants/enums";
import { filterOption, toOptions } from "../../utils/options";
import {
    areasApi,
    equipmentApi,
    equipmentTypesApi,
    getAccounts,
    plantsApi,
    proceduresApi,
    sitesApi,
} from "../catalogs/api/catalogsApi";

const toUpper = (value) => value?.toUpperCase();
const codeName = (x) => `${x.code} - ${x.name}`;

function EquipmentFields({ form, editing, lookups }) {
    const { t } = useTranslation();
    const { sites, plants, areas, equipmentTypes, procedures, accounts } = lookups;
    const siteId = Form.useWatch("siteId", form);
    const plantId = Form.useWatch("plantId", form);
    const equipmentTypeId = Form.useWatch("equipmentTypeId", form);

    const procedureOptions = toOptions(
        procedures.filter((x) => !x.equipmentTypeId || !equipmentTypeId || x.equipmentTypeId === equipmentTypeId),
        codeName,
        editing?.procedureId,
    );

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item name="tag" label={t("fields.tag")} normalize={toUpper} rules={[{ required: true }, { max: 50 }]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item name="name" label={t("fields.name")} rules={[{ required: true }, { max: 150 }]}>
                    <Input />
                </Form.Item>
            </Col>

            <Col span={8}>
                <Form.Item name="siteId" label={t("fields.site")} rules={[{ required: true }]}>
                    <Select
                        options={toOptions(sites, codeName, editing?.siteId)}
                        onChange={() => form.setFieldsValue({ plantId: undefined, areaId: undefined })}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="plantId" label={t("fields.plant")} rules={[{ required: true }]}>
                    <Select
                        showSearch
                        filterOption={filterOption}
                        disabled={!siteId}
                        options={toOptions(plants.filter((x) => x.siteId === siteId), codeName, editing?.plantId)}
                        onChange={() => form.setFieldValue("areaId", undefined)}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="areaId" label={t("fields.area")}>
                    <Select
                        allowClear
                        showSearch
                        filterOption={filterOption}
                        disabled={!plantId}
                        options={toOptions(areas.filter((x) => x.plantId === plantId), (x) => x.name, editing?.areaId)}
                    />
                </Form.Item>
            </Col>

            <Col span={8}>
                <Form.Item name="equipmentTypeId" label={t("fields.equipmentType")} rules={[{ required: true }]}>
                    <Select showSearch filterOption={filterOption} options={toOptions(equipmentTypes, codeName, editing?.equipmentTypeId)} />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item name="location" label={t("fields.location")} rules={[{ max: 200 }]}>
                    <Input />
                </Form.Item>
            </Col>

            <Col span={8}>
                <Form.Item name="brand" label={t("fields.brand")} rules={[{ max: 100 }]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="model" label={t("fields.model")} rules={[{ max: 100 }]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="serialNumber" label={t("fields.serialNumber")} rules={[{ max: 100 }]}>
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="procedureId" label={t("fields.procedure")}>
                    <Select allowClear showSearch filterOption={filterOption} options={procedureOptions} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="responsibleAccountId" label={t("fields.responsible")}>
                    <Select
                        allowClear
                        showSearch
                        filterOption={filterOption}
                        options={accounts.map((x) => ({ value: x.id, label: `${x.fullName} (${x.domainUserName})` }))}
                    />
                </Form.Item>
            </Col>

            <Col span={8}>
                <Form.Item name="frequency" label={t("fields.frequency")}>
                    <Select
                        allowClear
                        placeholder={t("fields.typeDefaultFrequency")}
                        options={getEnumOptions(MaintenanceFrequency, "MaintenanceFrequency", t)}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="criticality" label={t("fields.criticality")} rules={[{ required: true }]}>
                    <Select options={getEnumOptions(CriticalityLevel, "CriticalityLevel", t)} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="status" label={t("fields.status")} rules={[{ required: true }]}>
                    <Select options={getEnumOptions(EquipmentStatus, "EquipmentStatus", t)} />
                </Form.Item>
            </Col>

            <Col span={6}>
                <Form.Item name="hasBackup" label={t("fields.hasBackup")} valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Col>
            <Col span={18}>
                <Form.Item name="notes" label={t("fields.notes")} rules={[{ max: 1000 }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>
            </Col>
        </Row>
    );
}

export default function EquipmentPage() {
    const { t } = useTranslation();
    const { data: sites } = useRemoteList(sitesApi.list);
    const { data: plants } = useRemoteList(plantsApi.list);
    const { data: areas } = useRemoteList(areasApi.list);
    const { data: equipmentTypes } = useRemoteList(equipmentTypesApi.list);
    const { data: procedures } = useRemoteList(proceduresApi.list);
    const { data: accounts } = useRemoteList(getAccounts);
    const lookups = { sites, plants, areas, equipmentTypes, procedures, accounts };

    const [statusFilter, setStatusFilter] = useState(null);
    const [criticalityFilter, setCriticalityFilter] = useState(null);

    const filterRecords = useCallback(
        (records) =>
            records.filter(
                (x) =>
                    (!statusFilter || x.status === statusFilter) &&
                    (!criticalityFilter || x.criticality === criticalityFilter),
            ),
        [statusFilter, criticalityFilter],
    );

    const columns = [
        { title: t("fields.tag"), dataIndex: "tag", sorter: (a, b) => a.tag.localeCompare(b.tag) },
        { title: t("fields.name"), dataIndex: "name" },
        { title: t("fields.equipmentType"), dataIndex: "equipmentTypeName" },
        { title: t("fields.plant"), dataIndex: "plantCode", render: (_, x) => `${x.siteCode} / ${x.plantCode}` },
        { title: t("fields.area"), dataIndex: "areaName" },
        {
            title: t("fields.frequency"),
            dataIndex: "frequency",
            render: (v) => <EnumTag enumName="MaintenanceFrequency" value={v} />,
        },
        {
            title: t("fields.criticality"),
            dataIndex: "criticality",
            render: (v) => <EnumTag enumName="CriticalityLevel" value={v} colors={CriticalityLevelColor} />,
        },
        {
            title: t("fields.status"),
            dataIndex: "status",
            render: (v) => <EnumTag enumName="EquipmentStatus" value={v} colors={EquipmentStatusColor} />,
        },
    ];

    return (
        <CrudTable
            title={t("menu.equipment")}
            api={equipmentApi}
            columns={columns}
            modalWidth={900}
            getSearchText={(x) =>
                `${x.tag} ${x.name} ${x.equipmentTypeName} ${x.plantCode} ${x.areaName ?? ""} ${x.serialNumber ?? ""} ${x.brand ?? ""} ${x.model ?? ""}`
            }
            filterRecords={filterRecords}
            toolbar={
                <>
                    <Select
                        allowClear
                        placeholder={t("fields.status")}
                        style={{ width: 160 }}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={getEnumOptions(EquipmentStatus, "EquipmentStatus", t)}
                    />
                    <Select
                        allowClear
                        placeholder={t("fields.criticality")}
                        style={{ width: 160 }}
                        value={criticalityFilter}
                        onChange={setCriticalityFilter}
                        options={getEnumOptions(CriticalityLevel, "CriticalityLevel", t)}
                    />
                </>
            }
            newValues={{
                status: EquipmentStatus.Active,
                hasBackup: false,
                siteId: sites.length === 1 ? sites[0].id : undefined,
            }}
            toRequest={(values) => {
                const { siteId: _siteId, ...rest } = values;
                return {
                    ...rest,
                    areaId: rest.areaId ?? null,
                    procedureId: rest.procedureId ?? null,
                    responsibleAccountId: rest.responsibleAccountId ?? null,
                    frequency: rest.frequency ?? null,
                };
            }}
            renderForm={({ form, editing }) => <EquipmentFields form={form} editing={editing} lookups={lookups} />}
        />
    );
}