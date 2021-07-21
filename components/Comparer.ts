import differenceSrc from "./compute/difference.glsl"
import sumSrc from "./compute/sum.glsl"
import averageSrc from "./compute/average.glsl"
import renderSrc from "./compute/render.glsl"

import Compute from "./webgl/Compute"
import Texture from "./webgl/Texture"

export default class Comparer
{

    private readonly difference: Compute
    private readonly sum: Compute
    private readonly average: Compute
    private readonly render: Compute


    public constructor(private readonly gl: WebGL2RenderingContext, input: Texture, image: HTMLImageElement)
    {
        const width = image.width
        const height = image.height

        const target = new Texture(gl, gl.RGB8, width, height)
        target.write(image)

        // Calculate difference between rendered image and target
        const difference = new Texture(gl, gl.R32F, width, height)
        this.difference = new Compute(gl, differenceSrc, difference)

        this.difference.uniformTexture("data", input)
        this.difference.uniformTexture("target", target)

        // Sum columns
        const sum = new Texture(gl, gl.R32F, width, 1)
        this.sum = new Compute(gl, sumSrc, sum)

        this.sum.uniformTexture("difference", difference)

        const heightLocation = this.sum.uniformLocation("height")
        gl.uniform1i(heightLocation, height)

        // Average columns
        const average = new Texture(gl, gl.R32F, 1, 1)
        this.average = new Compute(gl, averageSrc, average)

        this.average.uniformTexture("difference", sum)

        const widthLocation = this.average.uniformLocation("width")
        gl.uniform1i(widthLocation, width)

        // Render result so we can monitor it
        this.render = new Compute(gl, renderSrc)
        this.render.uniformTexture("render", input)
    }


    public run(): void
    {
        const gl = this.gl
        gl.disable(gl.BLEND)

        // Run compute shaders
        this.difference.run()
        this.sum.run()
        this.average.run()

        // Read final result
        const result = new Float32Array(1)
        gl.readPixels(0, 0, 1, 1, gl.RED, gl.FLOAT, result)

        // console.log(result[0])
        this.render.run()
    }

}
