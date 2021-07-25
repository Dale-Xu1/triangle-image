import Image from "./triangle/Image"

export default class Exporter
{

    public constructor(private readonly image: Image) { }


    public export(width: number, height: number): string
    {
        const canvas = document.createElement("canvas")
        const c = canvas.getContext("2d")!

        canvas.width = width
        canvas.height = height

        // Give image white background
        c.fillStyle = "white"
        c.fillRect(0, 0, width, height)

        // Map image space to final image coordinates
        c.scale(width / this.image.width, height / this.image.height)

        this.render(c)
        return canvas.toDataURL()
    }

    private render(c: CanvasRenderingContext2D): void
    {
        for (const triangle of this.image.triangles)
        {
            c.beginPath()
            c.moveTo(triangle.a.x, triangle.a.y)
            c.lineTo(triangle.b.x, triangle.b.y)
            c.lineTo(triangle.c.x, triangle.c.y)

            const color = triangle.color
            c.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 256})`

            c.fill()
        }
    }

}
