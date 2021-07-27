import Vector2 from "../../webgl/math/Vector2"
import Random from "./Random"

export default class Point extends Vector2
{

    private static readonly RANGE: number = 5
    private static readonly DISTRIBUTION: number = 120

    public static random(width: number, height: number): Point
    {
        return new Point(Random.next(width), Random.next(height))
    }
    public static gaussian(): Point
    {
        return new Point(Random.gaussian() * Point.DISTRIBUTION, Random.gaussian() * Point.DISTRIBUTION)
    }


    public constructor(public readonly x: number, public readonly y: number)
    {
        super(x, y)
    }


    public add(point: Point): Point
    {
        return new Point(this.x + point.x, this.y + point.y)
    }

    public mutate(width: number, height: number): Point
    {
        const x = this.mutateValue(this.x, width)
        const y = this.mutateValue(this.y, height)

        return new Point(x, y)
    }

    private mutateValue(value: number, range: number): number
    {
        // Small chance the value is reset instead of perturbed
        return Random.next() < Random.RESET ? Random.next(range) : value + Random.gaussian() * Point.RANGE
    }

}
