import React, { Component, ReactElement } from "react"

import vertexSrc from "./shader/vertex.glsl"
import fragmentSrc from "./shader/fragment.glsl"

import Buffer from "./webgl/Buffer"
import Compute from "./webgl/Compute"
import Color from "./webgl/math/Color"
import Matrix3 from "./webgl/math/Matrix3"
import Vector2 from "./webgl/math/Vector2"
import Program, { Shader } from "./webgl/Program"

export default class Renderer extends Component
{

    private canvas = React.createRef<HTMLCanvasElement>()
    private gl!: WebGL2RenderingContext
    
    private position!: number
    private color!: number

    private matrix!: WebGLUniformLocation


    public componentDidMount(): void
    {
        let canvas = this.canvas.current!
        this.gl = canvas.getContext("webgl2")!

        // Compile shaders
        let vertex = new Shader(this.gl, this.gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSrc)
        
        let program = new Program(this.gl, vertex, fragment).program

        // Set resolution
        let resolution = this.gl.getUniformLocation(program, "u_resolution")

        let width = canvas.width = 720
        let height = canvas.height = 360

        this.gl.viewport(0, 0, width, height)
        this.gl.uniform2f(resolution, width, height)

        // Get attribute and uniform locations
        this.position = this.gl.getAttribLocation(program, "position")
        this.color = this.gl.getAttribLocation(program, "color")

        this.matrix = this.gl.getUniformLocation(program, "u_matrix")!

        new Compute()
        this.draw()
    }

    private a = 0
    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))
        this.a += 0.03

        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        // Apply transformations
        let transformation = Matrix3.rotation(this.a).scale(2, 1).translate(250, 150)
        this.gl.uniformMatrix3fv(this.matrix, true, transformation.data)

        let vertices = new Buffer(this.gl, this.gl.FLOAT)
        vertices.write(this.position, this.gl.DYNAMIC_DRAW,  [
            new Vector2(0, 0),
            new Vector2(100, 0),
            new Vector2(0, 100),
            new Vector2(0, 100),
            new Vector2(100, 0),
            new Vector2(100, 100)
        ])

        let colors = new Buffer(this.gl, this.gl.UNSIGNED_BYTE)
        colors.write(this.color, this.gl.DYNAMIC_DRAW, [
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
