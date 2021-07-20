import differenceSrc from "./compute/difference.glsl"
import sumSrc from "./compute/sum.glsl"
import renderSrc from "./compute/render.glsl"

import Compute from "./webgl/Compute"
import Texture from "./webgl/Texture"

export default class Comparer
{

    private readonly difference: Compute
    private readonly sum: Compute
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

        const location = this.sum.uniformLocation("height")
        gl.uniform1i(location, height)

        // Render result so we can monitor it
        this.render = new Compute(gl, renderSrc)
        this.render.uniformTexture("render", difference)
    }


    public run(): void
    {
        const gl = this.gl
        gl.disable(gl.BLEND)

        // Run compute shaders
        this.difference.run()
        this.sum.run()
        this.render.run() // This one doesn't really compute anything
    }

}
