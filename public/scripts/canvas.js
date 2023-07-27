//==================================
// EVENT LISTENER
//==================================

document.addEventListener("DOMContentLoaded", () => {
    update_size_screen()
    onupdate_camera()
})

window.addEventListener('resize', () => {
    update_size_screen()
    //draw()
})

GLOBAL.dom.canvas.addEventListener('mousedown', () => {
    GLOBAL.workspace.canvas.mouseDown = true
})

GLOBAL.dom.canvas.addEventListener('mouseup', (event) => {
    GLOBAL.workspace.canvas.mouseDown = false
    onupdate_camera()
})

GLOBAL.dom.canvas.addEventListener('wheel', (event) => {
    zoom(event)
})

GLOBAL.dom.canvas.addEventListener('mousemove', (event) => {
    get_position_mouse(event)
})

GLOBAL.dom.canvas.addEventListener('mousemove', (event) => {
    drag(GLOBAL.workspace.canvas.position.mouse)
    if(GLOBAL.workspace.canvas.mouseDown) {
        //draw()
    }
})

//==================================
// HELPER FUNCTIONS
//==================================

get_position_mouse = (e) => {
    if (e.pageX || e.pageY) {
        GLOBAL.workspace.canvas.position.mouse.x = e.pageX - GLOBAL.dom.container.offsetLeft
        GLOBAL.workspace.canvas.position.mouse.y = e.pageY - GLOBAL.dom.container.offsetTop
    }
    else if(e.clientX || e.clientY) {
        GLOBAL.workspace.canvas.position.mouse.x = e.clientX - GLOBAL.dom.container.offsetLeft
        GLOBAL.workspace.canvas.position.mouse.y = e.clientY - GLOBAL.dom.container.offsetTop
    }
}

update_size_screen = () => {
    console.log("resize")
    GLOBAL.workspace.rendering.position.screen.x = window.innerWidth
    GLOBAL.workspace.rendering.position.screen.y = window.innerHeight
    GLOBAL.workspace.rendering.position.camera.focus.x = window.innerWidth / 2
    GLOBAL.workspace.rendering.position.camera.focus.y = window.innerHeight / 2

    GLOBAL.dom.canvas.width = GLOBAL.dom.container.getBoundingClientRect().width
    GLOBAL.dom.canvas.height = GLOBAL.dom.container.getBoundingClientRect().height
}

clearCanvas = () => {
    GLOBAL.dom.context.clearRect(0, 0, GLOBAL.dom.canvas.width, GLOBAL.dom.canvas.height)
    GLOBAL.dom.canvas.width = GLOBAL.dom.canvas.width
}


drag = () => {
    if(GLOBAL.workspace.canvas.mouseDown) {
        if (GLOBAL.workspace.canvas.position.drag.x == null) GLOBAL.workspace.canvas.position.drag.x = GLOBAL.workspace.canvas.position.mouse.x
        if (GLOBAL.workspace.canvas.position.drag.y == null) GLOBAL.workspace.canvas.position.drag.y = GLOBAL.workspace.canvas.position.mouse.y

        let draggedX = GLOBAL.workspace.canvas.position.drag.x - GLOBAL.workspace.canvas.position.mouse.x
        let draggedY = GLOBAL.workspace.canvas.position.drag.y - GLOBAL.workspace.canvas.position.mouse.y

        GLOBAL.workspace.canvas.position.drag.x = GLOBAL.workspace.canvas.position.mouse.x
        GLOBAL.workspace.canvas.position.drag.y = GLOBAL.workspace.canvas.position.mouse.y

        GLOBAL.workspace.rendering.position.camera.offset.x += draggedX
        GLOBAL.workspace.rendering.position.camera.offset.y += draggedY

        GLOBAL.workspace.rendering.position.chunk.x = Math.floor(GLOBAL.workspace.rendering.position.camera.offset.x / GLOBAL.workspace.rendering.chunksize)
        GLOBAL.workspace.rendering.position.chunk.y = Math.floor(GLOBAL.workspace.rendering.position.camera.offset.y / GLOBAL.workspace.rendering.chunksize)

        draw()
    } else {
        GLOBAL.workspace.canvas.position.drag.x = null
        GLOBAL.workspace.canvas.position.drag.y = null
    }
}

zoom = (e) => {

    var xOld, yOld, xNew, yNew

    //Chrome
    if (e.deltaY / 120 < 0 && GLOBAL.workspace.rendering.scale < 30) {
        xOld = GLOBAL.workspace.canvas.position.mouse.x - GLOBAL.workspace.rendering.position.camera.focus.x;
        xNew = xOld * 1.15;
        GLOBAL.workspace.rendering.position.camera.focus.x -= ( xNew - xOld);

        yOld = GLOBAL.workspace.canvas.position.mouse.y - GLOBAL.workspace.rendering.position.camera.focus.y;
        yNew = yOld * 1.15;
        GLOBAL.workspace.rendering.position.camera.focus.y -= (yNew - yOld);

        GLOBAL.workspace.rendering.scale *= 2;
    }
    else if (e.deltaY / 120 > 0 && GLOBAL.workspace.rendering.scale >= 1) {
        xOld = GLOBAL.workspace.canvas.position.mouse.x - GLOBAL.workspace.rendering.position.camera.focus.x;
        xNew = xOld / 1.15;
        GLOBAL.workspace.rendering.position.camera.focus.x -= ( xNew - xOld);

        yOld = GLOBAL.workspace.canvas.position.mouse.y - GLOBAL.workspace.rendering.position.camera.focus.y;
        yNew = yOld / 1.15;
        GLOBAL.workspace.rendering.position.camera.focus.y -= ( yNew - yOld);

        GLOBAL.workspace.rendering.scale /= 2;
    }

    draw()
}

draw = async() => {
    const overlap = 1
    clearCanvas()

    for (var key in GLOBAL.workspace.data.images) {
        GLOBAL.dom.context.drawImage(
            GLOBAL.workspace.data.images[key],
            0,
            0,
            GLOBAL.workspace.rendering.chunksize, GLOBAL.workspace.rendering.chunksize,
            (get_coordinates_from_chunk_key(key)[0] * GLOBAL.workspace.rendering.chunksize) * GLOBAL.workspace.rendering.scale - 1 / 2 +
            Math.floor(GLOBAL.workspace.rendering.position.camera.focus.x - GLOBAL.workspace.rendering.position.camera.offset.x),
            (get_coordinates_from_chunk_key(key)[1] * GLOBAL.workspace.rendering.chunksize) * GLOBAL.workspace.rendering.scale - 1 / 2 +
            Math.floor(GLOBAL.workspace.rendering.position.camera.focus.y - GLOBAL.workspace.rendering.position.camera.offset.y),
            GLOBAL.workspace.rendering.chunksize * GLOBAL.workspace.rendering.scale + 1,
            GLOBAL.workspace.rendering.chunksize * GLOBAL.workspace.rendering.scale + 1
        );
    }
}

onupdate_camera = async() => {
    update_renderlist()
    emit_get_renderlist()
}

window.requestAnimFrame =(function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60)
    }
})()
