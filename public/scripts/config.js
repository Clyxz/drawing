var GLOBAL = {
    dom: {
        container: document.getElementById('container'),
        canvas: document.getElementById("canvas"),
        context: document.getElementById("canvas").getContext('2d')
    },
    workspace: {
        data: {
            base64s: {

            },
            images: {

            }
        },
        rendering: {
            distance: 2,
            chunksize: 128,
            position: {
                screen: {
                    x: window.innerWidth,
                    y: window.innerHeight
                },
                camera: {
                    focus: {
                        x: 0,
                        y: 0
                    },
                    offset: {
                        x: 0,
                        y: 0
                    }

                },
                chunk: {
                    x: null,
                    y: null
                }
            },
            scale: 1,
            renderlist: {}
        },
        canvas: {
            colors: {
                "00": "#ffffff",
                "01": "#2b2b2b",
                "02": "#2b2b2b",
                "03": "#2b2b2b",
                "04": "#2b2b2b",
                "05": "#2b2b2b",
                "06": "#2b2b2b",
                "07": "#2b2b2b",
                "08": "#2b2b2b",
                "09": "#2b2b2b",
                "10": "#2b2b2b",
            },
            position: {
                mouse: {
                    x: null,
                    y: null
                },
                drag: {
                    x: null,
                    y: null
                }
            },
            mouseDown: false
        }
    }
}