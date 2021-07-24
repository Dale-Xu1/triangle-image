import Buffer, { VertexArray } from "./Buffer"
import Texture from "./Texture"

export default class Program
{

    private readonly program: WebGLProgram
    private readonly array: VertexArray


    public constructor(private readonly gl: WebGL2RenderingContext, vertex: Shader, fragment: Shader)
    {
        this.program = gl.createProgram()!
        this.array = new VertexArray(gl)

        // Link program
        gl.attachShader(this.program, vertex.shader)
        gl.attachShader(this.program, fragment.shader)

        gl.linkProgram(this.program)
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            const log = gl.getProgramInfoLog(this.program)!
            gl.deleteProgram(this.program)

            throw log
        }

        this.use()
    }


    public use(): void
    {
        const gl = this.gl

        gl.useProgram(this.program)
        this.array.bind()
    }


    public bindAttribute(name: string, buffer: Buffer): void
    {
        const gl = this.gl

        // Get location of attribute
        const attribute = gl.getAttribLocation(this.program, name)
        this.array.attributePointer(attribute, buffer) // Point attribute to buffer
    }

    public uniformLocation(name: string): WebGLUniformLocation
    {
        return this.gl.getUniformLocation(this.program, name)!
    }

}

export class FrameBuffer
{

    private readonly buffer: WebGLFramebuffer


    public constructor(private readonly gl: WebGL2RenderingContext)
    {
        this.buffer = gl.createFramebuffer()!
    }


    public bind(): void
    {
        const gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    }

    public attachTexture(texture: Texture): void
    {
        const gl = this.gl

        this.bind()
        texture.bind()

        // Attach texture to frame buffer
        texture.write()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0)
    }

}

export class Shader
{

    public readonly shader: WebGLShader


    public constructor(gl: WebGL2RenderingContext, type: number, source: string)
    {
        this.shader = gl.createShader(type)!;

        gl.shaderSource(this.shader, source)
        gl.compileShader(this.shader)

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS))
        {
            const log = gl.getShaderInfoLog(this.shader)!
            gl.deleteShader(this.shader)

            throw log
        }
    }

}
