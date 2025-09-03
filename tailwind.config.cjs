/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
    safelist: [
        { pattern: /(bg|text|border)-(slate|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/ },
        { pattern: /(p|px|py|m|mx|my)-(0|1|2|3|4|5|6|8|10|12|16)/ },
    ]

}
