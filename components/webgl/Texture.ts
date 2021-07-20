export default class Texture
{

    private static index = 0


    public texture: WebGLTexture
    public index: number


    public constructor(private gl: WebGL2RenderingContext,
        private format: number, public width: number, public height: number)
    {
        this.texture = gl.createTexture()!
        this.index = Texture.index++

        this.bind()
    }


    public write(data: ArrayBufferView | HTMLImageElement | null): void
    {
        let gl = this.gl
        this.bind()

        // Set parameters
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        // Allocate texture
        let base = this.getBase(this.format)
        let type = this.getType(this.format)

        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, base, type, data as null)
    }

    private getBase(format: number): number
    {
        let gl = this.gl

        switch (format)
        {
            case gl.R8: case gl.R32F: return gl.RED
            case gl.RG8: case gl.RG32F: return gl.RG
            case gl.RGB8: case gl.RGB32F: return gl.RGB
            case gl.RGBA8: case gl.RGBA32F: return gl.RGBA
        }
        
        throw new Error(`Invalid format: ${format}`)
    }

    private getType(format: number): number
    {
        let gl = this.gl

        switch (format)
        {
            case gl.R8: case gl.RG8: case gl.RGB8: case gl.RGBA8: return gl.UNSIGNED_BYTE
            case gl.R32F: case gl.RG32F: case gl.RGB32F: case gl.RGBA32F: return gl.FLOAT
        }
        
        throw new Error(`Invalid format: ${format}`)
    }


    public bind(): void
    {
        let gl = this.gl

        // Bind texture to index
        gl.activeTexture(gl.TEXTURE0 + this.index)
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

}