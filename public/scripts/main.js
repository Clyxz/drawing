const socket = io('/')


socket.emit( 'join', {})

function emit_get_renderlist() {
    /*
    let missingchunks = []
    for (var key of GLOBAL.workspace.rendering.renderlist) {
        if (!GLOBAL.workspace.data.base64s[key]) {
            missingchunks.push(key)
        }
    }
*/
    socket.emit( 'get_chunks', {
        renderlist: GLOBAL.workspace.rendering.renderlist
    })
}


socket.on('get_chunks', function(response) {
    if (!response.success) return

    // TODO: reset?


    GLOBAL.workspace.data.base64s = {}
    GLOBAL.workspace.data.images = {}

    GLOBAL.workspace.data.base64s = response.chunkdata

    for (var key in GLOBAL.workspace.data.base64s) {
        let image = new Image()
        image.src = GLOBAL.workspace.data.base64s[key]

        GLOBAL.workspace.data.images[key] = image
    }

    console.log("chunks fetched fromn server")
    draw()
})