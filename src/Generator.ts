import Comparer from "./Comparer"
import Renderer from "./Renderer"
import Image from "./triangle/Image"
import Texture from "./webgl/Texture"

export default class Generator
{

    private static readonly BATCH_SIZE: number = 5

    private static readonly ITERATIONS: number = 200
    private static readonly MAX_ITERATIONS: number = 1000


    public readonly image: Image

    private readonly renderer: Renderer
    private readonly comparer: Comparer


    public constructor(canvas: HTMLCanvasElement, image: HTMLImageElement)
    {
        const width = canvas.width
        const height = canvas.height

        const gl = canvas.getContext("webgl2")!
        const result = new Texture(gl, gl.RGBA8, width, height)

        this.renderer = new Renderer(gl)
        this.comparer = new Comparer(gl, image, result)

        this.renderer.attachTexture(result)

        this.image = new Image(width, height)
        this.addTriangle()
    }

    private addTriangle(): void
    {
        this.image.addTriangle()
        this.image.error = this.compare()
    }

    private compare(): number
    {
        this.renderer.render(this.image)
        return this.comparer.compare()
    }


    private error: number = 1 // Error should never exceed 1 anyways

    private eden: boolean = true
    private iterations: number = 0

    public run(): void
    {
        window.requestAnimationFrame(this.run.bind(this))

        this.mutate()
        this.trackIterations()

        this.renderer.render(this.image, true)
    }

    private mutate(): void
    {
        // Select triangle to mutate
        const index = this.image.select()

        const triangle = this.image.triangles[index]
        let next = triangle

        for (let i = 0; i < Generator.BATCH_SIZE; i++)
        {
            // Mutate and compare triangle
            const mutated = triangle.mutate(this.image.width, this.image.height)
            this.image.triangles[index] = mutated

            const error = this.compare()
            if (error < this.image.error)
            {
                next = mutated
                this.image.error = error
            }
        }

        this.image.triangles[index] = next
    }

    private trackIterations(): void
    {
        if (this.eden)
        {
            // Leave Eden once image with new triangle is better than without
            if (this.image.error < this.error) this.eden = false
            else if (++this.iterations > Generator.MAX_ITERATIONS)
            {
                // We've reached a local minimum that doesn't improve the image
                this.image.resetTriangle()
                this.image.error = this.compare()
            }
            else return

            this.iterations = 0
        }
        else if (++this.iterations > Generator.ITERATIONS) // Remaining iterations to finalize triangle
        {
            this.error = this.image.error

            this.eden = true
            this.iterations = 0

            this.addTriangle()
        }
    }

}
