/** @type {import("prettier").Config} */
const config = {
    plugins: [import("prettier-plugin-tailwindcss")],
    tailwindStylesheet: "./app/globals.css",
    semi: true,
    singleQuote: true,
    trailingComma: "all",
};

export default config;