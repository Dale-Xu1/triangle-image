import { Vector } from "./Vector2"

export default class Color extends Vector
{

    public constructor(r: number, g: number, b: number, a = 255)
    {
        super([r, g, b, a])
    }

}
