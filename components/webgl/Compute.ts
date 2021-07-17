import vertexSrc from "./compute/vertex.glsl"
import fragmentSrc from "./compute/fragment.glsl"

import Buffer from "./Buffer"
import Program, { Shader } from "./Program"
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

    private gl: WebGL2RenderingContext


    public constructor()
    {
        let canvas = document.createElement("canvas")
        this.gl = canvas.getContext("webgl2")!

        // Compile shaders
        let vertex = new Shader(this.gl, this.gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSrc)
        
        let program = new Program(this.gl, vertex, fragment)

        // Write quad to position attribute
        let vertices = new Buffer(this.gl, this.gl.FLOAT, 2)
        program.bindAttribute("position", vertices)

        vertices.write(this.gl.STATIC_DRAW, Compute.vertices)
    }
    
}
