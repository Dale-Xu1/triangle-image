import React, { Component, ReactElement } from "react"

import Comparer from "./Comparer"
import Renderer from "./Renderer"
import Image from "./triangle/Image"
import Texture from "./webgl/Texture"

export default class Generator extends Component
{

    private static readonly BATCH_SIZE = 5;

    private static readonly ITERATIONS = 200;
    private static readonly MAX_ITERATIONS = 1000;


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

        const gl = canvas.getContext("webgl2")!
        const result = new Texture(gl, gl.RGBA8, width, height)

        this.renderer = new Renderer(gl)
        this.comparer = new Comparer(gl, target, result)

        this.renderer.attachTexture(result)

        this.image = new Image(width, height)
        this.addTriangle()

        this.draw()
    }

    private addTriangle(): void
    {
        this.image.addTriangle()
        this.image.error = this.compare()
    }

    private compare(): number
    {
        this.renderer.render(this.image)
        return this.comparer.compare()
    }


    private error = 1 // Error should never exceed 1 anyways

    private iterations = 0
    private remaining = 0

    private draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))

        this.mutate()
        this.trackIterations()

        this.renderer.render(this.image, true)
    }

    private mutate(): void
    {
        // Select triangle to mutate
        const index = this.image.select()

        const triangle = this.image.triangles[index]
        let next = triangle

        for (let i = 0; i < Generator.BATCH_SIZE; i++)
        {
            // Mutate and compare triangle
            const mutated = triangle.mutate(this.image.width, this.image.height)
            this.image.triangles[index] = mutated

            const error = this.compare()
            if (error < this.image.error)
            {
                next = mutated
                this.image.error = error
            }
        }

        this.image.triangles[index] = next
    }

    private trackIterations(): void
    {
        // Run a few more iterations once image with new triangle is better than without
        if (this.image.error < this.error)
        {
            this.remaining++
            if (this.remaining > Generator.ITERATIONS)
            {
                this.error = this.image.error

                this.iterations = 0
                this.remaining = 0

                this.addTriangle()
            }
        }
        else if (++this.iterations > Generator.MAX_ITERATIONS)
        {
            // We've reached a local minimum that doesn't improve the image
            this.iterations = 0

            this.image.resetTriangle()
            this.image.error = this.compare()
        }
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
