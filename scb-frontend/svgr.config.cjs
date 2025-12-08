module.exports = {
    expandProps: "end",
    svgProps: {
        className: "{props.className}"
    },
    svgo: true,
    svgoConfig: {
        plugins: [
            {
                name: "removeAttrs",
                params: {
                    attrs: ("fill:none")
                }
            },
            {
                name: "addAttributesToSVGElement",
                params: {
                    attributes: [
                        {
                            fill: "currentColor"
                        }
                    ]
                }
            }
        ]
    }
}