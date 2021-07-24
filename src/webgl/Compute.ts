import vertexSrc from "../compute/vertex.glsl"

import Buffer from "./Buffer"
import Program, { FrameBuffer, Shader } from "./Program"
import Texture from "./Texture"
import Vector2 from "./math/Vector2"

export default class Compute
{

    private static readonly VERTICES: Vector2[] =
    [
        new Vector2(-1, -1),
        new Vector2( 1, -1),
        new Vector2(-1,  1),
        new Vector2(-1,  1),
        new Vector2( 1, -1),
        new Vector2( 1,  1),
    ]


    private readonly program: Program
    private readonly frame: FrameBuffer

    private readonly width: number
    private readonly height: number


    public constructor(private readonly gl: WebGL2RenderingContext, fragmentSrc: string, texture: Texture)
    {
        // Compile shaders
        const vertex = new Shader(gl, gl.VERTEX_SHADER, vertexSrc)
        const fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

        this.program = new Program(gl, vertex, fragment)

        // Get result dimensions
        this.width = texture.width
        this.height = texture.height

        // Write quad to position attribute
        const vertices = new Buffer(gl, gl.FLOAT, 2)
        this.program.bindAttribute("position", vertices)

        vertices.write(gl.STATIC_DRAW, Compute.VERTICES)

        // Attach texture to be rendered to
        this.frame = new FrameBuffer(gl)
        this.frame.attachTexture(texture)
    }


    public uniformLocation(name: string): WebGLUniformLocation
    {
        return this.program.uniformLocation(name)
    }

    public uniformTexture(name: string, texture: Texture): void
    {
        const location = this.uniformLocation(name)
        this.gl.uniform1i(location, texture.index)
    }


    public run(): void
    {
        const gl = this.gl

        this.program.use()
        this.frame.bind()

        gl.viewport(0, 0, this.width, this.height)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

}
