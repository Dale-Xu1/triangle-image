import { Vector } from "../Buffer"

export default class Color extends Vector
{

    public constructor(r: number, g: number, b: number, a = 255)
    {
        super([ r, g, b, a ])
    }

}
