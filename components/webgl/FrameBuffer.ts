export default class FrameBuffer
{

    private buffer: WebGLFramebuffer


    public constructor(private gl: WebGL2RenderingContext)
    {
        this.buffer = gl.createFramebuffer()!
    }


    public bind(): void
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer)
    }

    public attatch(texture: Texture): void
    {
        this.bind()
        texture.bind()

        // Attatch texture to frame buffer
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture.texture, 0)
    }

}

export class Texture
{

    public texture: WebGLTexture


    public constructor(private gl: WebGL2RenderingContext, format: number, base: number, type: number)
    {
        this.texture = gl.createTexture()!
        this.bind()
        
        // Set parameters
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)

        // Allocate texture
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, format, 720, 360, 0, base, type, null)
    }

    public bind(): void
    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    }

}
