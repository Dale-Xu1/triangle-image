import Color from "./math/Color"
import Point from "./math/Point"

export default class Triangle
{

    public static random(width: number, height: number): Triangle
    {
        return new Triangle(
            Point.random(width, height),
            Point.random(width, height),
            Point.random(width, height),
            Color.random()
        )
    }


    public constructor(public readonly a: Point, public readonly b: Point, public readonly c: Point,
        public readonly color: Color) { }


    public mutate(width: number, height: number): Triangle
    {
        const a = this.a.mutate(width, height)
        const b = this.b.mutate(width, height)
        const c = this.c.mutate(width, height)

        const color = this.color.mutate()

        return new Triangle(a, b, c, color)
    }

}
