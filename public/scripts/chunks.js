function update_renderlist() {
    if (GLOBAL.workspace.rendering.position.chunk.x === null || GLOBAL.workspace.rendering.position.chunk.y === null) return

    GLOBAL.workspace.rendering.renderlist = {}
    for (var y = GLOBAL.workspace.rendering.position.chunk.y - GLOBAL.workspace.rendering.distance;
            y <= GLOBAL.workspace.rendering.position.chunk.y + GLOBAL.workspace.rendering.distance;
            y++) {
        for (var x = GLOBAL.workspace.rendering.position.chunk.x - GLOBAL.workspace.rendering.distance;
                x <= GLOBAL.workspace.rendering.position.chunk.x + GLOBAL.workspace.rendering.distance;
                x++) {
            GLOBAL.workspace.rendering.renderlist[generate_chunk_key(x, y)] = 1
        }
    }
    console.log("renderlist updated")
}

function generate_chunk_key(x, y) {
    return x + ":" + y
}

function get_coordinates_from_chunk_key(key) {
    return key.split(":")
}

/*
function create_empty_chunk() {
    return new Uint8Array(GLOBAL.workspace.rendering.chunksize * GLOBAL.workspace.rendering.chunksize).fill(1)
}

function array_to_base64(array) {
    return btoa(String.fromCharCode.apply(null, array))
}
*/

function base64_to_array(base64) {
    const binaryString = atob(base64)
    const uint8Array = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i)
    }

    return Array.from(uint8Array)
}



// Function to create a Uint8Array of white pixels
function create_empty_chunk() {
    // White pixel in RGBA
    const whitePixel = [255, 255, 255, 255];
    const size = GLOBAL.workspace.rendering.chunksize * GLOBAL.workspace.rendering.chunksize;
    const array = new Uint8Array(size * 4); // 4 for RGBA

    for (let i = 0; i < size; i++) {
        array.set(whitePixel, i * 4);
    }

    return array;
}

function array_to_base64(array) {
    let binary = '';
    const len = array.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(array[i]);
    }
    return window.btoa(binary);
}
