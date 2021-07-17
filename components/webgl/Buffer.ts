export default class Buffer
{

    public constructor(private gl: WebGLRenderingContext, private type: number, private normalized = true)
    {
        // Create and bind buffer
        let buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    }


    public write(attribute: number, usage: number, vectors: Vector[]): void
    {
        if (vectors.length === 0) return
        let length = vectors[0].length

        let data: number[] = []
        for (let vector of vectors) data.push(...vector.data)

        // Write data to buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cast(data), usage)

        // Read data from buffer to attribute
        this.gl.enableVertexAttribArray(attribute)
        this.gl.vertexAttribPointer(attribute, length, this.type, this.normalized, 0, 0)
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

export abstract class Vector
{

    public length: number


    protected constructor(public data: number[])
    {
        this.length = data.length
    }

}
