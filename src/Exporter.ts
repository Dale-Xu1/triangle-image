import Image from "./triangle/Image"

export default class Exporter
{

    public constructor(private readonly image: Image) { }


    public export(): void
    {
        const canvas = document.createElement("canvas")
        const c = canvas.getContext("2d")
    }

}
