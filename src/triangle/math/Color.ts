import Color4 from "../../webgl/math/Color4"
import Random from "./Random"

export default class Color extends Color4
{

    private static readonly EPSILON: number = 1e-13

    public static random(): Color
    {
        return new Color(Random.next(256), Random.next(256), Random.next(256), Random.next(256))
    }


    public constructor(public readonly r: number, public readonly g: number, public readonly b: number,
        public readonly a: number = 255)
    {
        super(r, g, b, a)
    }


    public mutate(): Color
    {
        const r = this.mutateValue(this.r)
        const g = this.mutateValue(this.g)
        const b = this.mutateValue(this.b)
        const a = this.mutateValue(this.a)

        return new Color(r, g, b, a)
    }

    private mutateValue(value: number): number
    {
        // Small chance the value is reset instead of perturbed
        if (Random.next() < Random.RESET) return Random.next(256)
        else
        {
            let result = value + Random.gaussian() * 12

            // Constrain values to be between 0 and 255
            if (result < 0) result = 0
            else if (result >= 256) result = 256 - Color.EPSILON

            return result
        }
    }

}
