import { createElement, useState } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import SitesTab from "./tabs/SitesTab";
import PlantsTab from "./tabs/PlantsTab";
import AreasTab from "./tabs/AreasTab";
import EquipmentTypesTab from "./tabs/EquipmentTypesTab";
import ProceduresTab from "./tabs/ProceduresTab";
import NonWorkingDaysTab from "./tabs/NonWorkingDaysTab";

const TABS = [
    { key: "sites", labelKey: "catalogs.sites", component: SitesTab },
    { key: "plants", labelKey: "catalogs.plants", component: PlantsTab },
    { key: "areas", labelKey: "catalogs.areas", component: AreasTab },
    { key: "equipmentTypes", labelKey: "catalogs.equipmentTypes", component: EquipmentTypesTab },
    { key: "procedures", labelKey: "catalogs.procedures", component: ProceduresTab },
    { key: "nonWorkingDays", labelKey: "catalogs.nonWorkingDays", component: NonWorkingDaysTab },
];

export default function CatalogsPage() {
    const { t } = useTranslation();
    const [activeKey, setActiveKey] = useState(TABS[0].key);

    // Only the active tab is mounted so its lookups (sites, plants, ...) are reloaded when switching tabs.
    return (
        <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={TABS.map(({ key, labelKey, component }) => ({
                key,
                label: t(labelKey),
                children: key === activeKey ? createElement(component) : null,
            }))}
        />
    );
}