import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Switch, Tooltip } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import CrudTable from "../../../components/common/CrudTable";
import ActiveTag from "../../../components/common/ActiveTag";
import useRemoteList from "../../../hooks/useRemoteList";
import { filterOption, toOptions } from "../../../utils/options";
import { equipmentTypesApi, proceduresApi } from "../api/catalogsApi";

const toUpper = (value) => value?.toUpperCase();

function ChecklistFields() {
    const { t } = useTranslation();

    return (
        <Form.List name="checklistItems">
            {(fields, { add, remove, move }) => (
                <>
                    {fields.map((field, index) => (
                        <Space key={field.key} align="baseline" style={{ display: "flex", marginBottom: 4 }}>
                            <span style={{ width: 24, textAlign: "right" }}>{index + 1}.</span>
                            <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[field.name, "description"]}
                                rules={[{ required: true, message: t("fields.checklistItemRequired") }, { max: 300 }]}
                                style={{ width: 430, marginBottom: 8 }}
                            >
                                <Input placeholder={t("fields.checklistItem")} />
                            </Form.Item>
                            <Form.Item name={[field.name, "isRequired"]} valuePropName="checked" style={{ marginBottom: 8 }}>
                                <Checkbox>{t("fields.isRequired")}</Checkbox>
                            </Form.Item>
                            <Form.Item name={[field.name, "isActive"]} valuePropName="checked" style={{ marginBottom: 8 }}>
                                <Checkbox>{t("fields.isActive")}</Checkbox>
                            </Form.Item>
                            <Tooltip title={t("crud.moveUp")}>
                                <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)} />
                            </Tooltip>
                            <Tooltip title={t("crud.moveDown")}>
                                <Button
                                    size="small"
                                    icon={<ArrowDownOutlined />}
                                    disabled={index === fields.length - 1}
                                    onClick={() => move(index, index + 1)}
                                />
                            </Tooltip>
                            <Tooltip title={t("crud.delete")}>
                                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                            </Tooltip>
                        </Space>
                    ))}
                    <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => add({ description: "", isRequired: true, isActive: true })}
                    >
                        {t("fields.addChecklistItem")}
                    </Button>
                </>
            )}
        </Form.List>
    );
}

export default function ProceduresTab({ onChanged }) {
    const { t } = useTranslation();
    const { data: equipmentTypes } = useRemoteList(equipmentTypesApi.list);

    const columns = [
        { title: t("fields.code"), dataIndex: "code", sorter: (a, b) => a.code.localeCompare(b.code) },
        { title: t("fields.name"), dataIndex: "name" },
        { title: t("fields.equipmentType"), dataIndex: "equipmentTypeName" },
        { title: t("fields.estimatedDuration"), dataIndex: "estimatedDurationMinutes" },
        { title: t("fields.checklist"), dataIndex: "checklistItems", render: (items) => items?.length ?? 0 },
        { title: t("fields.isActive"), dataIndex: "isActive", render: (v) => <ActiveTag value={v} /> },
    ];

    return (
        <CrudTable
            title={t("catalogs.procedures")}
            api={proceduresApi}
            columns={columns}
            onChanged={onChanged}
            modalWidth={860}
            getSearchText={(x) => `${x.code} ${x.name} ${x.equipmentTypeName ?? ""}`}
            newValues={{ isActive: true, estimatedDurationMinutes: 30, checklistItems: [] }}
            toRequest={(values) => ({
                ...values,
                equipmentTypeId: values.equipmentTypeId ?? null,
                estimatedDurationMinutes: values.estimatedDurationMinutes ?? 0,
                checklistItems: (values.checklistItems ?? []).map((item) => ({
                    ...item,
                    id: item.id ? Number(item.id) : null,
                })),
            })}
            renderForm={({ editing }) => (
                <>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="code" label={t("fields.code")} normalize={toUpper} rules={[{ required: true }, { max: 30 }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item name="name" label={t("fields.name")} rules={[{ required: true }, { max: 150 }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="equipmentTypeId" label={t("fields.equipmentType")}>
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={filterOption}
                                    options={toOptions(equipmentTypes, (x) => `${x.code} - ${x.name}`, editing?.equipmentTypeId)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="estimatedDurationMinutes" label={t("fields.estimatedDuration")}>
                                <InputNumber min={0} max={1440} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="isActive" label={t("fields.isActive")} valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label={t("fields.description")} rules={[{ max: 1000 }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Divider orientation="left" plain>
                        {t("fields.checklist")}
                    </Divider>
                    <ChecklistFields />
                </>
            )}
        />
    );
}