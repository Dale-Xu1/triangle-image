import { Vector } from "./math/Vector2"

export default class Buffer
{

    private buffer: WebGLBuffer


    public constructor(private gl: WebGL2RenderingContext,
        public type: number, public length: number, public normalized = true)
    {
        this.buffer = gl.createBuffer()!
    }


    public bind(): void
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
    }


    public write(usage: number, vectors: Vector[]): void
    {
        // Flatten vectors to data array
        let data: number[] = []
        for (let vector of vectors) data.push(...vector.data)

        this.bind()

        // Write data to buffer
        let buffer = this.cast(data)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, usage)
    }

    private cast(data: number[]): BufferSource
    {
        switch (this.type)
        {
            case this.gl.BYTE: return new Int8Array(data)
            case this.gl.SHORT: return new Int16Array(data)
            case this.gl.INT: return new Int32Array(data)
            case this.gl.UNSIGNED_BYTE: return new Uint8Array(data)
            case this.gl.UNSIGNED_SHORT: return new Uint16Array(data)
            case this.gl.UNSIGNED_INT: return new Uint32Array(data)
            case this.gl.FLOAT: return new Float32Array(data)
        }

        throw new Error(`Invalid type: ${this.type}`)
    }

}
