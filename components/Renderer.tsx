import React, { Component, ReactElement } from "react"

import vertexSrc from "./shader/vertex.glsl"
import fragmentSrc from "./shader/fragment.glsl"

import Compute from "./Compute"
import Buffer from "./webgl/Buffer"
import Color from "./webgl/math/Color"
import Matrix3 from "./webgl/math/Matrix3"
import Vector2 from "./webgl/math/Vector2"
import Program, { Shader } from "./webgl/Program"
import FrameBuffer, { Texture } from "./webgl/FrameBuffer"

export default class Renderer extends Component
{

    private canvas = React.createRef<HTMLCanvasElement>()
    private gl!: WebGL2RenderingContext
    
    private program!: Program

    private vertices!: Buffer
    private colors!: Buffer

    private compute!: Compute
    private frame!: FrameBuffer


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

        this.program = new Program(this.gl, vertex, fragment)

        // Initialize projection matrix
        let matrix = this.program.uniformLocation("u_matrix")
        this.gl.uniformMatrix3fv(matrix, true, Matrix3.projection(1, 1).data)

        // Bind attributes to buffers
        this.vertices = new Buffer(this.gl, this.gl.FLOAT, 2)
        this.colors = new Buffer(this.gl, this.gl.UNSIGNED_BYTE, 4)

        this.program.bindAttribute("position", this.vertices)
        this.program.bindAttribute("color", this.colors)

        this.compute = new Compute(this.gl)
        this.frame = new FrameBuffer(this.gl)

        let texture = new Texture(this.gl, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.frame.attatch(texture)

        this.draw()
    }

    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))

        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.program.use()
        this.frame.bind()

        this.vertices.write(this.gl.STATIC_DRAW, [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(0, 1),
            new Vector2(0, 1),
            new Vector2(1, 0),
            new Vector2(1, 1)
        ])
        this.colors.write(this.gl.STATIC_DRAW, [
            new Color(255, 0, 0),
            new Color(0, 255, 0),
            new Color(0, 0, 255),
            new Color(255, 255, 0),
            new Color(0, 255, 255),
            new Color(255, 0, 255)
        ])

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.compute.use()
        this.compute.draw()
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
