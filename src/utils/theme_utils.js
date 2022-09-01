const theme = {
    chalk: {
        //背景颜色
        backgroundColor: '#161522',
        // 标题的颜色
        titleColor: '#ffffff',
        themeSrc: 'qiehuan_dark.png',
        headerBorderSrc: 'header_border_dark.png'
    },
    vintage: {
        //背景颜色
        backgroundColor: '#eeeeee',
        // 标题的颜色
        titleColor: '#000000',
        themeSrc: 'qiehuan_light.png',
        headerBorderSrc: 'header_border_light.png'
    }
}
export function getThemeValue(themeName) {
    return theme[themeName]
}