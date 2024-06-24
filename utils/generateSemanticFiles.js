import { semanticFilter } from "./filters.js";

const commonFileOptions = {
    format: "css/variables",
    options: {
        selector: ":host",
    },
};

export const generateSemanticFiles = (excluded, theme) => {
    const filesArr = [];
    // theme-specific outputs
    filesArr.push({
        ...commonFileOptions,
        filter: semanticFilter(excluded, true),
        destination: `product/${theme.toLowerCase().replace(' ', '-')}.css`,
    });

    // not theme-specific outputs
    filesArr.push({
        ...commonFileOptions,
        filter: semanticFilter(excluded, false),
        destination: `semantic.css`,
    });

    return filesArr;
};