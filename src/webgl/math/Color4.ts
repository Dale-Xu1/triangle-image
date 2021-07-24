import { Vector } from "./Vector2"

export default class Color4 extends Vector
{

    public constructor(r: number, g: number, b: number, a: number = 255)
    {
        super([r, g, b, a])
    }

}
