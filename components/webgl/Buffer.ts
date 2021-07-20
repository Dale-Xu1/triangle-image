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
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    }


    public write(usage: number, vectors: Vector[]): void
    {
        let gl = this.gl

        // Flatten vectors to data array
        let data: number[] = []
        for (let vector of vectors) data.push(...vector.data)

        this.bind()

        // Write data to buffer
        let buffer = this.cast(data)
        gl.bufferData(gl.ARRAY_BUFFER, buffer, usage)
    }

    private cast(data: number[]): BufferSource
    {
        let gl = this.gl

        switch (this.type)
        {
            case gl.BYTE: return new Int8Array(data)
            case gl.SHORT: return new Int16Array(data)
            case gl.INT: return new Int32Array(data)
            case gl.UNSIGNED_BYTE: return new Uint8Array(data)
            case gl.UNSIGNED_SHORT: return new Uint16Array(data)
            case gl.UNSIGNED_INT: return new Uint32Array(data)
            case gl.FLOAT: return new Float32Array(data)
        }

        throw new Error(`Invalid type: ${this.type}`)
    }

}

export class VertexArray
{

    private array: WebGLVertexArrayObject


    public constructor(private gl: WebGL2RenderingContext)
    {
        this.array = gl.createVertexArray()!
    }


    public bind(): void
    {
        this.gl.bindVertexArray(this.array)
    }

    public attributePointer(attribute: number, buffer: Buffer)
    {
        let gl = this.gl

        this.bind()
        buffer.bind()

        // Instruct how to read data from buffer to attribute
        gl.enableVertexAttribArray(attribute)
        gl.vertexAttribPointer(attribute, buffer.length, buffer.type, buffer.normalized, 0, 0)
    }
    
}
