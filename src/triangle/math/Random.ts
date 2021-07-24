export default class Random
{

    public static readonly RESET: number = 0.05

    public static next(range: number = 1): number
    {
        return Math.random() * range
    }


    private static nextGaussian: number | null = null

    public static gaussian(): number
    {
        if (this.nextGaussian !== null)
        {
            const next = this.nextGaussian
            this.nextGaussian = null

            return next
        }
        else
        {
            let v1, v2, s;
            do
            {
                v1 = this.next(2) - 1
                v2 = this.next(2) - 1

                s = v1 ** 2 + v2 ** 2;
            }
            while (s >= 1 || s == 0);

            const mult = Math.sqrt(-2 * Math.log(s) / s)
            this.nextGaussian = v2 * mult

            return v1 * mult
        }
    }

}
