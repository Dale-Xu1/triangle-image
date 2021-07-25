import Head from "next/head"
import React, { ChangeEvent, Component, ReactElement } from "react"

import Exporter from "../src/Exporter"
import Generator from "../src/Generator"

interface State
{

    href: string

    width: number
    height: number

}

export default class Home extends Component<object, State>
{

    public state: State =
    {
        href: "#",
        width: 1920,
        height: 1080
    }

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private readonly image = React.createRef<HTMLImageElement>()

    private generator!: Generator


    public constructor(props: object)
    {
        super(props)

        this.export = this.export.bind(this)

        this.updateWidth = this.updateWidth.bind(this)
        this.updateHeight = this.updateHeight.bind(this)
    }


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const image = this.image.current!

        canvas.width = image.width
        canvas.height = image.height

        this.generator = new Generator(canvas, image)
        this.generator.run()
    }

    public componentWillUnmount(): void
    {
        this.generator.stop()
    }


    private export(): void
    {
        const exporter = new Exporter(this.generator.image)

        // Point link to data URL; yeah, I don't get why downloading is done this way either
        const href = exporter.export(this.state.width, this.state.height)
        this.setState({ href })
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

                <input type="number" value={this.state.width} onChange={this.updateWidth} />
                <input type="number" value={this.state.height} onChange={this.updateHeight} />
                <a
                    href={this.state.href}
                    download="result.png"
                    onClick={this.export}
                >
                    Export
                </a>
            </div>
        )
    }

    private updateWidth(e: ChangeEvent<HTMLInputElement>): void
    {
        this.setState({ width: window.parseInt(e.target.value) })
    }
    private updateHeight(e: ChangeEvent<HTMLInputElement>): void
    {
        this.setState({ height: window.parseInt(e.target.value) })
    }

}
