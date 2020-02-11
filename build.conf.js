module.exports = {
    module: {
        name: 'pipSettings',
        styles: 'index',
        export: 'pip.settings',
        standalone: 'pip.settings'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    browserify: {
        entries: [
            './src/index.ts',
            './temp/pip-suite-settings-html.min.js',
        ]
    },
    file: {
        lib: [
            '../node_modules/pip-webui-all/dist/**/*',
            '../pip-suite-rest/dist/**/*',
            '../pip-suite-data/dist/**/*',
            '../pip-suite-entry/dist/**/*'
        ]
    },
    samples: {
        port: 8150,
        https: false
    },
    api: {
        port: 8151
    }
};
