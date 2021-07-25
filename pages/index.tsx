import Head from "next/head"
import React, { Component, ReactElement } from "react"

import Exporter from "../src/Exporter"
import Generator from "../src/Generator"

export default class Home extends Component
{

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private readonly image = React.createRef<HTMLImageElement>()

    private readonly link = React.createRef<HTMLAnchorElement>()
    private generator!: Generator


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const image = this.image.current!

        canvas.width = image.width
        canvas.height = image.height

        this.generator = new Generator(canvas, image)
        this.generator.run()
    }

    private export(): void
    {
        const exporter = new Exporter(this.generator.image)

        // Point link to data URL; yeah, I don't get why downloading is done this way either
        const link = this.link.current!
        link.href = exporter.export(1920, 1080)
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
                <a
                    href="#"
                    download="result.png"
                    onClick={this.export.bind(this)}
                    ref={this.link}
                >
                    Export
                </a>
            </div>
        )
    }

}
