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
    private image = React.createRef<HTMLImageElement>()

    private width!: number
    private height!: number

    private gl!: WebGL2RenderingContext
    private program!: Program

    private vertices!: Buffer
    private colors!: Buffer

    private compute!: Compute
    private frame!: FrameBuffer


    public componentDidMount(): void
    {
        let canvas = this.canvas.current!
        let image = this.image.current!

        this.width = canvas.width = image.width
        this.height = canvas.height = image.height

        this.gl = canvas.getContext("webgl2")!
        let gl = this.gl

        // gl.getExtension("EXT_color_buffer_float")

        // Compile shaders
        let vertex = new Shader(gl, gl.VERTEX_SHADER, vertexSrc)
        let fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

        this.program = new Program(gl, vertex, fragment)

        // Initialize projection matrix
        let matrix = this.program.uniformLocation("u_matrix")
        gl.uniformMatrix3fv(matrix, true, Matrix3.projection(this.width, this.height).data)

        // Bind attributes to buffers
        this.vertices = new Buffer(gl, gl.FLOAT, 2)
        this.colors = new Buffer(gl, gl.UNSIGNED_BYTE, 4)

        this.program.bindAttribute("position", this.vertices)
        this.program.bindAttribute("color", this.colors)


        this.frame = new FrameBuffer(gl)

        let render = new Texture(gl, gl.RGBA8, this.width, this.height)
        let texture = new Texture(gl, gl.RGBA8, this.width, this.height)

        render.write(null)
        texture.write(image)

        this.frame.attach(render)

        this.compute = new Compute(gl, render, texture)
        this.draw()
    }

    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))
        let gl = this.gl

        this.program.use()
        this.frame.bind()

        // Clear canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.enable(gl.BLEND)
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

        this.vertices.write(gl.STATIC_DRAW, [
            new Vector2(0, 0),
            new Vector2(this.width, 0),
            new Vector2(0, this.height),
            new Vector2(0, 0),
            new Vector2(this.width, 0),
            new Vector2(this.width, this.height)
        ])
        this.colors.write(gl.STATIC_DRAW, [
            new Color(255, 0, 0, 200),
            new Color(0, 255, 0, 200),
            new Color(0, 0, 255, 200),
            new Color(255, 255, 0, 100),
            new Color(0, 255, 255, 100),
            new Color(255, 0, 255, 100)
        ])

        gl.drawArrays(gl.TRIANGLES, 0, 6)

        this.compute.use()
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.compute.draw()
    }

    public render(): ReactElement
    {
        return (
            <div>
                <canvas ref={this.canvas} />
                <img src="/forest.jpg" alt="" ref={this.image} />
            </div>
        )
    }

}
