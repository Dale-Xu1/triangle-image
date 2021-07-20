export abstract class Vector
{

    protected constructor(public readonly data: number[]) { }

}

export default class Vector2 extends Vector
{

    public constructor(x: number, y: number)
    {
        super([x, y])
    }

}
