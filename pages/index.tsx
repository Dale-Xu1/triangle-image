import Head from "next/head"
import { Component, ReactElement } from "react"

import Renderer from "../components/Renderer"

export default class Home extends Component
{

    public render(): ReactElement
    {
        return (
            <div>
                <Head>
                    <title>Triangle Image</title>
                </Head>
                <Renderer />
            </div>
        )
    }

}
