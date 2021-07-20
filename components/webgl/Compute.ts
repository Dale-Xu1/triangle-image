import vertexSrc from "../compute/vertex.glsl"

import Buffer from "./Buffer"
import Program, { Shader } from "./Program"
import Texture from "./Texture"
import Vector2 from "./math/Vector2"

export default class Compute
{

    private static vertices =
    [
        new Vector2(-1, -1),
        new Vector2( 1, -1),
        new Vector2(-1,  1),
        new Vector2(-1,  1),
        new Vector2( 1, -1),
        new Vector2( 1,  1),
    ]

    private program: Program


    public constructor(private gl: WebGL2RenderingContext, fragmentSrc: string, texture: Texture | null = null)
    {
        // Compile shaders
        let vertex = new Shader(gl, gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

        this.program = new Program(gl, vertex, fragment)

        // Write quad to position attribute
        let vertices = new Buffer(gl, gl.FLOAT, 2)
        this.program.bindAttribute("position", vertices)

        vertices.write(gl.STATIC_DRAW, Compute.vertices)

        // Attach texture to be rendered to
        if (texture !== null)
        {
            texture.write(null)
            this.program.attachTexture(texture)
        }
    }


    public uniformLocation(name: string): WebGLUniformLocation
    {
        return this.program.uniformLocation(name)
    }

    public uniformTexture(name: string, texture: Texture): void
    {
        let location = this.uniformLocation(name)
        this.gl.uniform1i(location, texture.index)
    }


    public run(): void
    {
        let gl = this.gl
        this.program.use()

        // gl.viewport(0, 0, )
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    
}
