module.exports = {
    expandProps: 'end',
    svgProps: {
        className: 'icon'
    },
    svgo: true,
    svgoConfig: {
        plugins: [
            {
                name: 'addAttributesToSVGElement',
                params: {
                    attributes: [
                        {
                            'fill': 'currentColor'
                        }
                    ]
                }
            }
        ]
    }
}