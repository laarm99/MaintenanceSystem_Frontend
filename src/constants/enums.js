// Mirrors the backend enums (MaintenanceSystem.Domain.Enums). Values are stored as text in the DB.

export const MaintenanceStatus = Object.freeze({
    Scheduled: "Scheduled",
    Upcoming: "Upcoming",
    InProgress: "InProgress",
    Completed: "Completed",
    Overdue: "Overdue",
    NotPerformed: "NotPerformed",
    Cancelled: "Cancelled",
});

export const MaintenanceFrequency = Object.freeze({
    Monthly: "Monthly",
    Bimonthly: "Bimonthly",
    Quarterly: "Quarterly",
    Semiannual: "Semiannual",
    Annual: "Annual",
});

export const CriticalityLevel = Object.freeze({
    Low: "Low",
    Medium: "Medium",
    High: "High",
    Critical: "Critical",
});

export const EquipmentStatus = Object.freeze({
    Active: "Active",
    Inactive: "Inactive",
    OutOfService: "OutOfService",
    Retired: "Retired",
    Replaced: "Replaced",
    NotLocated: "NotLocated",
});

export const PlanStatus = Object.freeze({
    Draft: "Draft",
    Published: "Published",
    Closed: "Closed",
});

export const NonWorkingDayType = Object.freeze({
    Holiday: "Holiday",
    PlantShutdown: "PlantShutdown",
    Other: "Other",
});

export const AuditAction = Object.freeze({
    Created: "Created",
    Updated: "Updated",
    Deleted: "Deleted",
    Rescheduled: "Rescheduled",
    Started: "Started",
    Completed: "Completed",
    NotPerformed: "NotPerformed",
    Cancelled: "Cancelled",
});

// Order matches the recommended load order (MaintenanceSystem.Application.Modules.Imports.ImportType).
export const ImportType = Object.freeze({
    Sites: "Sites",
    Plants: "Plants",
    Areas: "Areas",
    EquipmentTypes: "EquipmentTypes",
    Procedures: "Procedures",
    ProcedureChecklistItems: "ProcedureChecklistItems",
    NonWorkingDays: "NonWorkingDays",
    Equipment: "Equipment",
});

export const ImportRowAction = Object.freeze({
    Create: "Create",
    Update: "Update",
    Unchanged: "Unchanged",
    Error: "Error",
});

// Ant Design Tag colors.
export const MaintenanceStatusColor = Object.freeze({
    [MaintenanceStatus.Scheduled]: "blue",
    [MaintenanceStatus.Upcoming]: "gold",
    [MaintenanceStatus.InProgress]: "cyan",
    [MaintenanceStatus.Completed]: "green",
    [MaintenanceStatus.Overdue]: "red",
    [MaintenanceStatus.NotPerformed]: "volcano",
    [MaintenanceStatus.Cancelled]: "default",
});

export const CriticalityLevelColor = Object.freeze({
    [CriticalityLevel.Low]: "green",
    [CriticalityLevel.Medium]: "gold",
    [CriticalityLevel.High]: "orange",
    [CriticalityLevel.Critical]: "red",
});

export const EquipmentStatusColor = Object.freeze({
    [EquipmentStatus.Active]: "green",
    [EquipmentStatus.Inactive]: "default",
    [EquipmentStatus.OutOfService]: "orange",
    [EquipmentStatus.Retired]: "default",
    [EquipmentStatus.Replaced]: "purple",
    [EquipmentStatus.NotLocated]: "red",
});

export const PlanStatusColor = Object.freeze({
    [PlanStatus.Draft]: "default",
    [PlanStatus.Published]: "blue",
    [PlanStatus.Closed]: "green",
});

export const ImportRowActionColor = Object.freeze({
    [ImportRowAction.Create]: "green",
    [ImportRowAction.Update]: "blue",
    [ImportRowAction.Unchanged]: "default",
    [ImportRowAction.Error]: "red",
});

/**
 * Builds Select options for an enum using the "enums.<EnumName>.<Value>" translation keys.
 */
export const getEnumOptions = (enumObject, enumName, t) =>
    Object.values(enumObject).map((value) => ({
        value,
        label: t(`enums.${enumName}.${value}`),
    }));
