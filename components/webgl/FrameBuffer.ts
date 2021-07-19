export default class FrameBuffer
{

    private buffer: WebGLFramebuffer


    public constructor(private gl: WebGL2RenderingContext)
    {
        this.buffer = gl.createFramebuffer()!
    }


    public bind(): void
    {
        let gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    }

    public attatch(texture: Texture): void
    {
        let gl = this.gl

        this.bind()
        texture.bind()

        // Attatch texture to frame buffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0)
    }

}

export class Texture
{

    public texture: WebGLTexture


    public constructor(private gl: WebGL2RenderingContext,
        format: number, width: number, height: number)
    {
        this.texture = gl.createTexture()!
        this.bind()

        // Set parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        // Allocate texture
        let base = this.getBase(format)
        let type = this.getType(format)

        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, base, type, null)
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
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

}
