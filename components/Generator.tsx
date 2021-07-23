import React, { Component, ReactElement } from "react"

import Comparer from "./Comparer"
import Renderer from "./Renderer"
import Image from "./triangle/Image"
import Texture from "./webgl/Texture"

export default class Generator extends Component
{

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private readonly target = React.createRef<HTMLImageElement>()

    private image!: Image

    private renderer!: Renderer
    private comparer!: Comparer


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const target = this.target.current!

        const width = canvas.width = target.width
        const height = canvas.height = target.height

        this.image = new Image(width, height)

        const gl = canvas.getContext("webgl2")!
        const result = new Texture(gl, gl.RGBA8, width, height)

        this.renderer = new Renderer(gl)
        this.comparer = new Comparer(gl, target, result)

        this.renderer.attachTexture(result)
        this.draw()
    }

    private draw(): void
    {
        // window.requestAnimationFrame(this.draw.bind(this))

        // for (let i = 0; i < 3; i++)
        // {
            this.renderer.render(this.image)
            const difference = this.comparer.compare()

            console.log(difference)
        // }
    }

    public render(): ReactElement
    {
        return (
            <div>
                <canvas ref={this.canvas} />
                <img src="/forest.jpg" alt="" ref={this.target} />
            </div>
        )
    }

}
