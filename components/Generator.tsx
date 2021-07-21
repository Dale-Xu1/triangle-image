import React, { Component, ReactElement } from "react"

import Comparer from "./Comparer"
import Renderer from "./Renderer"
import Texture from "./webgl/Texture"

export default class Generator extends Component
{

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private readonly image = React.createRef<HTMLImageElement>()

    private renderer!: Renderer
    private comparer!: Comparer


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const image = this.image.current!

        canvas.width = image.width
        canvas.height = image.height

        const gl = canvas.getContext("webgl2")!
        const result = new Texture(gl, gl.RGBA8, canvas.width, canvas.height)

        this.renderer = new Renderer(gl)
        this.comparer = new Comparer(gl, image, result)
        
        this.renderer.attachTexture(result)
        this.draw()
    }

    private draw(): void
    {
        // window.requestAnimationFrame(this.draw.bind(this))

        for (let i = 0; i < 3; i++)
        {
            this.renderer.render()
            const difference = this.comparer.compare()

            console.log(difference)
        }
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
