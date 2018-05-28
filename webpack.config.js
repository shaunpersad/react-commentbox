module.exports = {
    mode: 'production',
    entry: './commentbox/src/components/CommentBox.jsx',
    output: {
        path: '/usr/src/app',
        filename: 'commentbox.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
};