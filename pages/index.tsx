import Head from "next/head"
import React, { Component, ReactElement } from "react"

import Generator from "../components/Generator"

export default class Home extends Component
{

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private readonly image = React.createRef<HTMLImageElement>()


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const image = this.image.current!

        canvas.width = image.width
        canvas.height = image.height

        const generator = new Generator(canvas, image)
        generator.run()
    }

    public render(): ReactElement
    {
        return (
            <div>
                <Head>
                    <title>Triangle Image</title>
                </Head>
                <canvas ref={this.canvas} />
                <img src="/forest.jpg" alt="" ref={this.image} />
                <button>Save</button>
            </div>
        )
    }

}
