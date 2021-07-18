import vertexSrc from "./compute/vertex.glsl"
import fragmentSrc from "./compute/fragment.glsl"

import Buffer from "./webgl/Buffer"
import Program, { Shader } from "./webgl/Program"
import Vector2 from "./webgl/math/Vector2"
import Texture from "./webgl/Texture"

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


        let texture = new Texture(this.gl, this.gl.R8, this.gl.RED, this.gl.UNSIGNED_BYTE)
        texture.write(3, 2, [1, 2, 3, 4, 5, 6])

        let data = program.uniformLocation("data")
        this.gl.uniform1i(data, 0)

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

        let results = new Uint8Array(24)
        this.gl.readPixels(0, 0, 3, 2, this.gl.RGBA, this.gl.UNSIGNED_BYTE, results)

        for (let i = 0; i < 6; i++) console.log(results[i * 4])
    }


    public run()
    {

    }
    
}
