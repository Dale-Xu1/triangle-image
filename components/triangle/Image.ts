import Color from "./math/Color"
import Point from "./math/Point"
import Random from "./math/Random"
import Triangle from "./Triangle"

export default class Image
{

    public readonly triangles: Triangle[] = []
    public error!: number


    public constructor(public readonly width: number, public readonly height: number)
    {
        this.addTriangle()
    }


    public select(): number
    {
        return 0
    }

    public addTriangle(): void
    {
        this.triangles.push(Triangle.random(this.width, this.height))
    }


    public getPoints(): Point[]
    {
        const points: Point[] = []
        for (const triangle of this.triangles)
        {
            points.push(triangle.a)
            points.push(triangle.b)
            points.push(triangle.c)
        }

        return points
    }

    public getColors(): Color[]
    {
        const colors: Color[] = []
        for (const triangle of this.triangles)
        {
            // One reference to the color for each point of the triangle
            for (let i = 0; i < 3; i++) colors.push(triangle.color)
        }

        return colors
    }

}
