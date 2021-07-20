export default class Matrix3
{

    public static readonly identity = new Matrix3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ])

    public static projection(width: number, height: number): Matrix3
    {
        return Matrix3.scale(2 / width, -2 / height).translate(-1, 1)
    }

    public static translation(x: number, y: number): Matrix3
    {
        return new Matrix3([
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ])
    }

    public static rotation(a: number): Matrix3
    {
        const s = Math.sin(a)
        const c = Math.cos(a)

        return new Matrix3([
            c,-s, 0,
            s, c, 0,
            0, 0, 1
        ])
    }

    public static scale(x: number, y: number): Matrix3
    {
        return new Matrix3([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ])
    }


    public constructor(public readonly data: number[]) { }


    public mult(matrix: Matrix3): Matrix3
    {
        const a = this.data
        const b = matrix.data

        return new Matrix3([
            (a[0] * b[0]) + (a[3] * b[1]) + (a[6] * b[2]),
            (a[1] * b[0]) + (a[4] * b[1]) + (a[7] * b[2]),
            (a[2] * b[0]) + (a[5] * b[1]) + (a[8] * b[2]),
            (a[0] * b[3]) + (a[3] * b[4]) + (a[6] * b[5]),
            (a[1] * b[3]) + (a[4] * b[4]) + (a[7] * b[5]),
            (a[2] * b[3]) + (a[5] * b[4]) + (a[8] * b[5]),
            (a[0] * b[6]) + (a[3] * b[7]) + (a[6] * b[8]),
            (a[1] * b[6]) + (a[4] * b[7]) + (a[7] * b[8]),
            (a[2] * b[6]) + (a[5] * b[7]) + (a[8] * b[8])
        ])
    }


    public translate(x: number, y: number): Matrix3
    {
        return this.mult(Matrix3.translation(x, y))
    }

    public rotate(a: number): Matrix3
    {
        return this.mult(Matrix3.rotation(a))
    }

    public scale (x: number, y: number)
    {
        return this.mult(Matrix3.scale(x, y))
    }

}
