import { Vector } from "./math/Vector2"

export default class Buffer
{

    public static cast(gl: WebGL2RenderingContext, type: number, data: number[]): ArrayBufferView
    {
        switch (type)
        {
            case gl.BYTE: return new Int8Array(data)
            case gl.SHORT: return new Int16Array(data)
            case gl.INT: return new Int32Array(data)
            case gl.UNSIGNED_BYTE: return new Uint8Array(data)
            case gl.UNSIGNED_SHORT: return new Uint16Array(data)
            case gl.UNSIGNED_INT: return new Uint32Array(data)
            case gl.FLOAT: return new Float32Array(data)
        }

        throw new Error(`Invalid type: ${type}`)
    }


    private buffer: WebGLBuffer


    public constructor(private gl: WebGL2RenderingContext,
        public type: number, public length: number, public normalized = true)
    {
        this.buffer = gl.createBuffer()!
    }

    public bind()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
    }


    public write(usage: number, vectors: Vector[]): void
    {
        let data: number[] = []
        for (let vector of vectors) data.push(...vector.data)

        this.bind()

        // Write data to buffer
        let buffer = Buffer.cast(this.gl, this.type, data)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, usage)
    }
    
}
