import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, App, Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import useRemoteList from "../../hooks/useRemoteList";
import { getApiError } from "../../utils/apiError";

/**
 * Generic list + create/edit modal + delete for a catalog.
 *
 * - api: { list, create, update, remove } (see services/crudApi.js)
 * - columns: AntD table columns (the actions column is added here)
 * - getSearchText(record): text used by the search box
 * - renderForm({ form, editing }): Form.Item elements
 * - newValues: initial form values when creating
 * - toFormValues(record) / toRequest(values, editing): map between API DTO and form values
 * - filterRecords(records): optional extra filter applied after search (e.g. toolbar filters)
 * - toolbar: optional extra elements next to the search box
 */
export default function CrudTable({
    title,
    api,
    columns,
    getSearchText,
    renderForm,
    newValues = {},
    toFormValues = (record) => record,
    toRequest = (values) => values,
    filterRecords,
    toolbar,
    modalWidth = 560,
    onChanged,
}) {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const { data, loading, reload } = useRemoteList(api.list);

    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const records = useMemo(() => {
        const term = search.trim().toLowerCase();
        let result = term
            ? data.filter((record) => (getSearchText?.(record) ?? "").toLowerCase().includes(term))
            : data;
        if (filterRecords) result = filterRecords(result);
        return result;
    }, [data, search, getSearchText, filterRecords]);

    const openModal = (record) => {
        setEditing(record);
        setSaveError(null);
        form.resetFields();
        form.setFieldsValue(record ? toFormValues(record) : newValues);
        setOpen(true);
    };

    const handleSave = async () => {
        let values;
        try {
            values = await form.validateFields();
        } catch {
            return;
        }

        setSaving(true);
        setSaveError(null);
        try {
            const body = toRequest(values, editing);
            if (editing) await api.update(editing.id, body);
            else await api.create(body);
            message.success(t("crud.saved"));
            setOpen(false);
            await reload();
            onChanged?.();
        } catch (error) {
            setSaveError(getApiError(error, t("crud.saveError")));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            await api.remove(record.id);
            message.success(t("crud.deleted"));
            await reload();
            onChanged?.();
        } catch (error) {
            message.error(getApiError(error, t("crud.deleteError")).message, 6);
        }
    };

    const tableColumns = [
        ...columns,
        {
            title: t("crud.actions"),
            key: "actions",
            width: 110,
            fixed: "right",
            render: (_, record) => (
                <Space>
                    <Tooltip title={t("crud.edit")}>
                        <Button size="small" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    </Tooltip>
                    <Popconfirm
                        title={t("crud.confirmDelete")}
                        okText={t("crud.delete")}
                        cancelText={t("crud.cancel")}
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Tooltip title={t("crud.delete")}>
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            size="small"
            title={title}
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
                    {t("crud.new")}
                </Button>
            }
        >
            <Space wrap style={{ marginBottom: 12 }}>
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder={t("crud.search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 280 }}
                />
                {toolbar}
                <Tooltip title={t("crud.reload")}>
                    <Button icon={<ReloadOutlined />} onClick={reload} />
                </Tooltip>
            </Space>

            <Table
                size="small"
                rowKey="id"
                loading={loading}
                columns={tableColumns}
                dataSource={records}
                scroll={{ x: "max-content" }}
                pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (total) => t("crud.total", { total }) }}
            />

            <Modal
                open={open}
                width={modalWidth}
                title={editing ? t("crud.editTitle", { title }) : t("crud.newTitle", { title })}
                okText={t("crud.save")}
                cancelText={t("crud.cancel")}
                confirmLoading={saving}
                onOk={handleSave}
                onCancel={() => setOpen(false)}
                forceRender
            >
                {saveError && (
                    <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 12 }}
                        message={saveError.message}
                        description={
                            saveError.details.length > 0 && (
                                <ul style={{ margin: 0, paddingLeft: 18 }}>
                                    {saveError.details.map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                            )
                        }
                    />
                )}
                <Form form={form} layout="vertical">
                    {renderForm({ form, editing })}
                </Form>
            </Modal>
        </Card>
    );
}