import vertexSrc from "./compute/vertex.glsl"
import fragmentSrc from "./compute/fragment.glsl"

import Buffer from "./webgl/Buffer"
import Program, { Shader } from "./webgl/Program"
import Vector2 from "./webgl/math/Vector2"

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


    public constructor(private gl: WebGL2RenderingContext)
    {
        // Compile shaders
        let vertex = new Shader(gl, gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

        this.program = new Program(gl, vertex, fragment)

        // Write quad to position attribute
        let vertices = new Buffer(gl, gl.FLOAT, 2)
        this.program.bindAttribute("position", vertices)

        vertices.write(gl.STATIC_DRAW, Compute.vertices)
    }

    public use(): void
    {
        this.program.use()
    }


    public draw(): void
    {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
    
}
