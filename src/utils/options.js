/**
 * Select options from a catalog list. Inactive items are disabled unless they are the current value.
 */
export function toOptions(list, getLabel, currentValue) {
    return list.map((item) => ({
        value: item.id,
        label: getLabel(item),
        disabled: item.isActive === false && item.id !== currentValue,
    }));
}

export const filterOption = (input, option) =>
    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase());