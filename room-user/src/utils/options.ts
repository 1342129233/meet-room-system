export interface ConvertMap {
    value: number;
    label: string;
}

export const convertMap = (data: { [key in string]: any }, key?: string) => {
    const optionMap: Array<ConvertMap> = [];
    Object.keys(data).forEach((val: string) => {
        optionMap.push({
            value: +val,
            label: key ? data[val][key] : data[val]
        });
    });
    return optionMap;
};