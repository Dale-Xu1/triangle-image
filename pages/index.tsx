import Head from "next/head"
import React, { ChangeEvent, Component, ReactElement } from "react"

import Main from "../components/Main"

interface State
{

    image: ImageData | null
    data: string

}

export default class Home extends Component<object, State>
{

    private static readonly HEIGHT: number = 512

    public state: State =
    {
        image: null,
        data: ""
    }


    public constructor(props: object)
    {
        super(props)
        this.select = this.select.bind(this)
    }


    private async select(e: ChangeEvent<HTMLInputElement>): Promise<void>
    {
        const file = e.target.files![0]
        const canvas = document.createElement("canvas")

        const image = await this.resize(file, canvas)
        const data = canvas.toDataURL()

        this.setState({ image, data })
    }

    private async resize(file: File, canvas: HTMLCanvasElement): Promise<ImageData>
    {
        const c = canvas.getContext("2d")!

        // Get image
        const source = await this.read(file)
        const image = await this.image(source)

        // Proportionally scale width to match fixed height
        const width = Math.floor(canvas.width = image.width / image.height * Home.HEIGHT)
        const height = canvas.height = Home.HEIGHT

        // Draw image onto canvas to get resized data
        c.drawImage(image, 0, 0, width, height)
        return c.getImageData(0, 0, width, height)
    }

    private async image(source: string): Promise<HTMLImageElement>
    {
        return new Promise(handler)
        function handler(res: (result: HTMLImageElement) => void, rej: () => void): void
        {
            // Load data from file into Image object
            const image = new Image()
            image.src = source

            image.onload = () => res(image)
        }
    }

    private async read(file: File): Promise<string>
    {
        return new Promise(handler)
        function handler(res: (result: string) => void, rej: () => void): void
        {
            const reader = new FileReader()

            // Resolve promise with file data
            reader.onload = () => res(reader.result as string)
            reader.onerror = rej

            reader.readAsDataURL(file)
        }
    }


    public render(): ReactElement
    {
        return (
            <div>
                <Head>
                    <title>Triangle Image</title>
                </Head>

                <input type="file" accept="image/*" onChange={this.select} />
                {this.state.image &&
                    <div>
                        <img src={this.state.data} alt="" />
                        <Main image={this.state.image} />
                    </div>
                }
            </div>
        )
    }

}
