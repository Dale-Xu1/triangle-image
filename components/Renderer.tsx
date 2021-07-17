import React, { Component, ReactElement } from "react"

import vertexSrc from "./webgl/shader/vertex.glsl"
import fragmentSrc from "./webgl/shader/fragment.glsl"

import Buffer from "./webgl/Buffer"
// import Compute from "./webgl/Compute"
import Color from "./webgl/math/Color"
import Matrix3 from "./webgl/math/Matrix3"
import Vector2 from "./webgl/math/Vector2"
import Program, { Shader } from "./webgl/Program"

export default class Renderer extends Component
{

    private canvas = React.createRef<HTMLCanvasElement>()
    private gl!: WebGL2RenderingContext
    
    private vertices!: Buffer
    private colors!: Buffer


    public componentDidMount(): void
    {
        let canvas = this.canvas.current!
        this.gl = canvas.getContext("webgl2")!

        let width = canvas.width = 720
        let height = canvas.height = 360
        
        this.gl.viewport(0, 0, width, height)

        // Compile shaders
        let vertex = new Shader(this.gl, this.gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSrc)

        let program = new Program(this.gl, vertex, fragment)

        // Initialize projection matrix
        let matrix = program.uniformLocation("u_matrix")
        this.gl.uniformMatrix3fv(matrix, true, Matrix3.projection(1, 1).data)

        // Bind attributes to buffers
        this.vertices = new Buffer(this.gl, this.gl.FLOAT, 2)
        this.colors = new Buffer(this.gl, this.gl.UNSIGNED_BYTE, 4)

        program.bindAttribute("position", this.vertices)
        program.bindAttribute("color", this.colors)

        // new Compute()
        this.draw()
    }

    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))

        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.vertices.write(this.gl.DYNAMIC_DRAW, [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(0, 1),
            new Vector2(0, 1),
            new Vector2(1, 0),
            new Vector2(1, 1)
        ])
        this.colors.write(this.gl.DYNAMIC_DRAW, [
            new Color(255, 0, 0),
            new Color(0, 255, 0),
            new Color(0, 0, 255),
            new Color(255, 255, 0),
            new Color(0, 255, 255),
            new Color(255, 0, 255)
        ])

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
    
    public render(): ReactElement
    {
        return (
            <div>
                <canvas ref={this.canvas}></canvas>
            </div>
        )
    }

}
