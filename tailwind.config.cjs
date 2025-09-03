/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
    safelist: [
        { pattern: /(bg|text|border)-(red|blue|green|yellow|purple|pink|indigo|gray)-(100|200|300|400|500|600|700|800|900)/ },
        { pattern: /(p|m|px|py|mx|my)-(0|1|2|3|4|5|6|8|10|12|16)/ },
        { pattern: /(rounded|shadow|grid-cols)-(sm|md|lg|xl|2xl|none|xs|1|2|3|4|5|6)/ },
    ],
}
