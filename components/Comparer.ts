import differenceSrc from "./compute/difference.glsl"
import sumSrc from "./compute/sum.glsl"
import renderSrc from "./compute/render.glsl"

import Compute from "./webgl/Compute"
import Texture from "./webgl/Texture"

export default class Comparer
{

    public input: Texture

    private difference: Compute
    private sum: Compute
    private render: Compute


    public constructor(private gl: WebGL2RenderingContext, image: HTMLImageElement)
    {
        let width = image.width
        let height = image.height

        // Create texture buffers to store data
        this.input = new Texture(gl, gl.RGBA8, width, height)
        let target = new Texture(gl, gl.RGB8, width, height)

        this.input.write(null)
        target.write(image)

        // Calculate difference between rendered image and target
        let difference = new Texture(gl, gl.R32F, width, height)
        this.difference = new Compute(gl, differenceSrc, difference)

        this.difference.uniformTexture("data", this.input)
        this.difference.uniformTexture("target", target)

        // Sum columns
        let sum = new Texture(gl, gl.R32F, width, 1)
        this.sum = new Compute(gl, sumSrc, sum)

        // Render result so we can monitor it
        this.render = new Compute(gl, renderSrc)
        this.render.uniformTexture("render", difference)
    }


    public run(): void
    {
        let gl = this.gl
        gl.disable(gl.BLEND)

        // Run compute shaders
        this.difference.run()
        // this.sum.run()
        this.render.run() // This one doesn't really compute anything
    }

}
