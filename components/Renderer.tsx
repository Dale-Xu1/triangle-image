import React, { Component, ReactElement } from "react"

import vertex from "./shader/vertex.glsl"
import fragment from "./shader/fragment.glsl"

import Program from "./Program"

export default class Renderer extends Component
{

    private canvas = React.createRef<HTMLCanvasElement>()


    public componentDidMount(): void
    {
        let canvas = this.canvas.current!
        let gl = canvas.getContext("webgl2")!

        canvas.width = 720
        canvas.height = 360

        let program = new Program(gl, vertex, fragment)
        program.draw()
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
