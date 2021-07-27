import React, { ChangeEvent, Component, ReactElement } from "react"

import Exporter from "../src/Exporter"
import Generator from "../src/Generator"

interface Props
{

    image: ImageData

}

interface State
{

    href: string

    width: number
    height: number

}

export default class Main extends Component<Props, State>
{

    private static readonly RESOLUTION: number = 1920


    public state: State

    private readonly canvas = React.createRef<HTMLCanvasElement>()
    private generator!: Generator


    public constructor(props: Props)
    {
        super(props)

        // Precalculate result resolution based on original aspect ratio
        let width: number
        let height: number

        const image = this.props.image
        if (image.width > image.height)
        {
            width = Main.RESOLUTION
            height = Math.floor(Main.RESOLUTION * image.height / image.width)
        }
        else
        {
            width = Math.floor(Main.RESOLUTION * image.width / image.height)
            height = Main.RESOLUTION
        }

        this.state =
        {
            href: "#",
            width,
            height
        }

        this.export = this.export.bind(this)

        this.updateWidth = this.updateWidth.bind(this)
        this.updateHeight = this.updateHeight.bind(this)
    }


    public componentDidMount(): void
    {
        const canvas = this.canvas.current!
        const image = this.props.image

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
                <canvas ref={this.canvas} />
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
