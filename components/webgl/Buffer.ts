import { Vector } from "./math/Vector2"

export default class Buffer
{

    private buffer: WebGLBuffer


    public constructor(private gl: WebGL2RenderingContext,
        public type: number, public length: number, public normalized = true)
    {
        // Create buffer
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

        // Write data to buffer
        this.bind()
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cast(data), usage)
    }

    private cast(data: number[]): BufferSource
    {
        switch (this.type)
        {
            case this.gl.BYTE: return new Int8Array(data)
            case this.gl.SHORT: return new Int16Array(data)
            case this.gl.UNSIGNED_BYTE: return new Uint8Array(data)
            case this.gl.UNSIGNED_SHORT: return new Uint16Array(data)
            case this.gl.FLOAT: return new Float32Array(data)
        }

        throw new Error(`Invalid type: ${this.type}`)
    }
    
}
