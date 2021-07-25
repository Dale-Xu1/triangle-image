import Color from "./math/Color"
import Point from "./math/Point"

export default class Triangle
{

    private static readonly MIN_WIDTH = 4

    public static random(width: number, height: number): Triangle
    {
        const a = Point.random(width, height)
        const b = Point.random(width, height)
        const c = Point.random(width, height)

        // Discard triangle if result is too thin
        if (Triangle.thin(a, b, c)) return Triangle.random(width, height)
        return new Triangle(a, b, c, Color.random())
    }

    private static thin(a: Point, b: Point, c: Point): boolean
    {
        // Find length of longest side
        const max = Math.max(Triangle.dist(a, b), Triangle.dist(b, c), Triangle.dist(c, a))
        const area = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)

        const s = area / Triangle.MIN_WIDTH
        return s * s < max
    }

    private static dist(a: Point, b: Point): number
    {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
    }


    public constructor(public readonly a: Point, public readonly b: Point, public readonly c: Point,
        public readonly color: Color) { }


    public mutate(width: number, height: number): Triangle
    {
        const a = this.a.mutate(width, height)
        const b = this.b.mutate(width, height)
        const c = this.c.mutate(width, height)

        // Discard triangle if result is too thin
        if (Triangle.thin(a, b, c)) return this.mutate(width, height)

        const color = this.color.mutate()
        return new Triangle(a, b, c, color)
    }

}
