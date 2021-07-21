import Head from "next/head"
import { Component, ReactElement } from "react"

import Generator from "../components/Generator"

export default class Home extends Component
{

    public render(): ReactElement
    {
        return (
            <div>
                <Head>
                    <title>Triangle Image</title>
                </Head>
                <Generator />
            </div>
        )
    }

}
