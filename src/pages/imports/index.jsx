import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Empty,
    List,
    Row,
    Space,
    Spin,
    Statistic,
    Table,
    Tag,
    Typography,
    Upload,
} from "antd";
import {
    CheckCircleOutlined,
    CloudUploadOutlined,
    DownloadOutlined,
    InboxOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import EnumTag from "../../components/common/EnumTag";
import { ImportRowAction, ImportRowActionColor } from "../../constants/enums";
import { downloadImportTemplate, getImportDefinitions, uploadImport } from "./api/importsApi";

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    const message = data?.message ?? data?.Message ?? fallback;
    const details = Array.isArray(data?.errors) ? data.errors : [];
    return { message, details };
};

export default function ImportsPage() {
    const { t } = useTranslation();
    const { message } = App.useApp();

    const [definitions, setDefinitions] = useState([]);
    const [loadingDefinitions, setLoadingDefinitions] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [working, setWorking] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        getImportDefinitions()
            .then((response) => {
                setDefinitions(response.data);
                setSelectedType(response.data[0]?.type ?? null);
            })
            .catch((error) => message.error(getErrorMessage(error, t("imports.loadError")).message))
            .finally(() => setLoadingDefinitions(false));
    }, [message, t]);

    const definition = useMemo(
        () => definitions.find((x) => x.type === selectedType),
        [definitions, selectedType],
    );

    const resetUpload = () => {
        setFile(null);
        setResult(null);
        setRequestError(null);
    };

    const selectType = (type) => {
        setSelectedType(type);
        resetUpload();
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadImportTemplate(selectedType);
        } catch {
            message.error(t("imports.templateError"));
        } finally {
            setDownloading(false);
        }
    };

    const handleUpload = async (commit) => {
        setWorking(true);
        setRequestError(null);
        try {
            const response = await uploadImport(selectedType, file, commit);
            setResult(response.data);
            if (response.data.committed) {
                message.success(t("imports.committed"));
            } else if (response.data.errorCount > 0) {
                message.warning(t("imports.hasErrors"));
            }
        } catch (error) {
            setResult(null);
            setRequestError(getErrorMessage(error, t("imports.uploadError")));
        } finally {
            setWorking(false);
        }
    };

    const canCommit = !!file && !!result && !result.committed && result.errorCount === 0;

    const columnColumns = [
        {
            title: t("imports.column"),
            dataIndex: "name",
            render: (name, column) => (
                <Typography.Text strong={column.required} code>
                    {name}
                    {column.required ? " *" : ""}
                </Typography.Text>
            ),
        },
        { title: t("imports.description"), dataIndex: "description" },
        {
            title: t("imports.allowedValues"),
            dataIndex: "allowedValues",
            render: (values) => values?.map((v) => <Tag key={v}>{v}</Tag>),
        },
        { title: t("imports.example"), dataIndex: "example" },
    ];

    const resultColumns = [
        { title: t("imports.row"), dataIndex: "rowNumber", width: 80 },
        { title: t("imports.key"), dataIndex: "key", width: 220 },
        {
            title: t("imports.action"),
            dataIndex: "action",
            width: 140,
            filters: Object.values(ImportRowAction).map((value) => ({
                value,
                text: t(`enums.ImportRowAction.${value}`),
            })),
            onFilter: (value, row) => row.action === value,
            render: (value) => (
                <EnumTag enumName="ImportRowAction" value={value} colors={ImportRowActionColor} />
            ),
        },
        {
            title: t("imports.errors"),
            dataIndex: "errors",
            render: (errors) =>
                errors?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {errors.map((e, i) => (
                            <li key={i}>
                                <Typography.Text type="danger">{e}</Typography.Text>
                            </li>
                        ))}
                    </ul>
                ) : null,
        },
    ];

    if (loadingDefinitions) {
        return <Spin style={{ display: "block", margin: 48 }} />;
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} lg={7} xl={6}>
                <Card title={t("imports.title")} size="small">
                    <Typography.Paragraph type="secondary">{t("imports.orderHint")}</Typography.Paragraph>
                    <List
                        dataSource={definitions}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => selectType(item.type)}
                                style={{
                                    cursor: "pointer",
                                    paddingInline: 8,
                                    borderRadius: 6,
                                    background: item.type === selectedType ? "#fff3e8" : undefined,
                                }}
                            >
                                <Space>
                                    <Tag color={item.type === selectedType ? "orange" : "default"}>
                                        {item.order}
                                    </Tag>
                                    {t(`enums.ImportType.${item.type}`)}
                                </Space>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>

            <Col xs={24} lg={17} xl={18}>
                {!definition ? (
                    <Card>
                        <Empty />
                    </Card>
                ) : (
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        <Card
                            size="small"
                            title={t(`enums.ImportType.${definition.type}`)}
                            extra={
                                <Button icon={<DownloadOutlined />} loading={downloading} onClick={handleDownload}>
                                    {t("imports.downloadTemplate")}
                                </Button>
                            }
                        >
                            <Alert
                                type="info"
                                showIcon
                                style={{ marginBottom: 12 }}
                                message={
                                    definition.dependsOn.length
                                        ? t("imports.dependsOn", {
                                              list: definition.dependsOn
                                                  .map((x) => t(`enums.ImportType.${x}`))
                                                  .join(", "),
                                          })
                                        : t("imports.noDependencies")
                                }
                                description={t("imports.rules")}
                            />
                            <Table
                                size="small"
                                rowKey="name"
                                pagination={false}
                                columns={columnColumns}
                                dataSource={definition.columns}
                            />
                        </Card>

                        <Card size="small" title={t("imports.uploadTitle")}>
                            <Upload.Dragger
                                accept=".xlsx"
                                maxCount={1}
                                fileList={file ? [file] : []}
                                beforeUpload={(f) => {
                                    setFile(f);
                                    setResult(null);
                                    setRequestError(null);
                                    return false;
                                }}
                                onRemove={resetUpload}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">{t("imports.dragText")}</p>
                                <p className="ant-upload-hint">{t("imports.dragHint")}</p>
                            </Upload.Dragger>

                            <Space style={{ marginTop: 12 }}>
                                <Button
                                    icon={<SafetyCertificateOutlined />}
                                    disabled={!file}
                                    loading={working}
                                    onClick={() => handleUpload(false)}
                                >
                                    {t("imports.validate")}
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<CloudUploadOutlined />}
                                    disabled={!canCommit}
                                    loading={working}
                                    onClick={() => handleUpload(true)}
                                >
                                    {t("imports.import")}
                                </Button>
                            </Space>

                            {requestError && (
                                <Alert
                                    type="error"
                                    showIcon
                                    style={{ marginTop: 12 }}
                                    message={requestError.message}
                                    description={
                                        requestError.details.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {requestError.details.map((e, i) => (
                                                    <li key={i}>{e}</li>
                                                ))}
                                            </ul>
                                        )
                                    }
                                />
                            )}
                        </Card>

                        {result && (
                            <Card
                                size="small"
                                title={t("imports.resultTitle")}
                                extra={
                                    result.committed ? (
                                        <Tag icon={<CheckCircleOutlined />} color="green">
                                            {t("imports.saved")}
                                        </Tag>
                                    ) : (
                                        <Tag color={result.errorCount ? "red" : "blue"}>
                                            {result.errorCount ? t("imports.notSaved") : t("imports.readyToImport")}
                                        </Tag>
                                    )
                                }
                            >
                                <Row gutter={16} style={{ marginBottom: 12 }}>
                                    <Col span={4}>
                                        <Statistic title={t("imports.total")} value={result.totalRows} />
                                    </Col>
                                    <Col span={5}>
                                        <Statistic
                                            title={t("enums.ImportRowAction.Create")}
                                            value={result.createdCount}
                                            valueStyle={{ color: "#389e0d" }}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <Statistic
                                            title={t("enums.ImportRowAction.Update")}
                                            value={result.updatedCount}
                                            valueStyle={{ color: "#1677ff" }}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <Statistic
                                            title={t("enums.ImportRowAction.Unchanged")}
                                            value={result.unchangedCount}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <Statistic
                                            title={t("enums.ImportRowAction.Error")}
                                            value={result.errorCount}
                                            valueStyle={{ color: result.errorCount ? "#cf1322" : undefined }}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    size="small"
                                    rowKey="rowNumber"
                                    columns={resultColumns}
                                    dataSource={result.rows}
                                    pagination={{ pageSize: 20, showSizeChanger: true }}
                                />
                            </Card>
                        )}
                    </Space>
                )}
            </Col>
        </Row>
    );
}
