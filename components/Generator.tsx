import React, { Component, ReactElement } from "react"

import Comparer from "./Comparer"
import Renderer from "./Renderer"
import Image from "./triangle/Image"
import Texture from "./webgl/Texture"

export default class Generator extends Component
{

    private static readonly BATCH_SIZE = 3;    


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

        // Calculate initial error of image
        this.image.error = this.error()
        this.draw()
    }


    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))

        // Select triangle to mutate
        const index = this.image.select()

        const triangle = this.image.triangles[index]
        let next = triangle

        for (let i = 0; i < Generator.BATCH_SIZE; i++)
        {
            // Mutate and compare triangle
            const mutated = triangle.mutate(this.image.width, this.image.height)
            this.image.triangles[index] = mutated

            const error = this.error()
            if (error < this.image.error)
            {
                next = mutated
                this.image.error = error
            }
        }

        this.image.triangles[index] = next
        this.renderer.render(this.image, true)
    }

    private error(): number
    {
        this.renderer.render(this.image)
        return this.comparer.compare()
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
