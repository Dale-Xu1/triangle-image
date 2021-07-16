import React, { Component, ReactElement } from "react"

import vertex from "./shader/vertex.glsl"

export default class Renderer extends Component
{

    private canvas = React.createRef<HTMLCanvasElement>()


    public componentDidMount(): void
    {
        console.log(vertex)
        let canvas = this.canvas.current!
        let gl = canvas.getContext("webgl2")!

        let shader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(shader, vertex)
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
