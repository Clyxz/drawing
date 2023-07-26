const socket = io('/')


socket.emit( 'join', {})

function emit_get_renderlist() {

    let missingchunks = []
    for (var key in GLOBAL.workspace.rendering.renderlist) {
        if (!GLOBAL.workspace.data.base64s[key]) {
            missingchunks.push(key)
        }
    }
    if (!missingchunks.length) return

    socket.emit( 'get_chunks', {
        renderlist: missingchunks
    })
}

socket.on('get_chunks', function(response) {
    if (!response.success) return

    for (var key in GLOBAL.workspace.data.base64s) {
        if (!GLOBAL.workspace.rendering.renderlist[key]) {
            delete GLOBAL.workspace.data.base64s[key]
        }
    }
    GLOBAL.workspace.data.base64s = {...GLOBAL.workspace.data.base64s, ...response.chunkdata}


    GLOBAL.workspace.data.images = {}
    for (var key in GLOBAL.workspace.data.base64s) {
        let image = new Image()
        image.src = GLOBAL.workspace.data.base64s[key]

        GLOBAL.workspace.data.images[key] = image
    }

    console.log("chunks fetched from server")
    draw()
})