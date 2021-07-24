import differenceSrc from "./compute/difference.glsl"
import sumSrc from "./compute/sum.glsl"
import averageSrc from "./compute/average.glsl"
import blurSrc from "./compute/blur.glsl"

import Compute from "./webgl/Compute"
import Matrix3 from "./webgl/math/Matrix3"
import Texture from "./webgl/Texture"

export default class Comparer
{

    private static readonly BLUR = new Matrix3([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ])
    private static readonly BLUR_WEIGHT: number = 16

    private static readonly SOBEL_X = new Matrix3([
        1,  0, -1,
        2,  0, -2,
        1,  0, -1
    ])
    private static readonly SOBEL_Y = new Matrix3([
        1,  2,  1,
        0,  0,  0,
       -1, -2, -1
    ])


    private readonly difference: Compute
    private readonly sum: Compute
    private readonly average: Compute


    public constructor(private readonly gl: WebGL2RenderingContext, image: HTMLImageElement, input: Texture)
    {
        const width = image.width
        const height = image.height

        const target = this.blur(image)

        // Calculate difference between rendered image and target
        const difference = new Texture(gl, gl.R32F, width, height)
        this.difference = new Compute(gl, differenceSrc, difference)

        this.difference.uniformTexture("u_data", input)
        this.difference.uniformTexture("u_target", target)

        gl.uniform2i(this.difference.uniformLocation("u_resolution"), width, height)

        gl.uniform1fv(this.difference.uniformLocation("u_sobelX"), Comparer.SOBEL_X.data)
        gl.uniform1fv(this.difference.uniformLocation("u_sobelY"), Comparer.SOBEL_Y.data)

        // Sum columns
        const sum = new Texture(gl, gl.R32F, width, 1)
        this.sum = new Compute(gl, sumSrc, sum)

        this.sum.uniformTexture("u_difference", difference)
        gl.uniform1i(this.sum.uniformLocation("u_height"), height)

        // Average columns
        const average = new Texture(gl, gl.R32F, 1, 1)
        this.average = new Compute(gl, averageSrc, average)

        this.average.uniformTexture("u_difference", sum)
        gl.uniform1i(this.average.uniformLocation("u_width"), width)
    }

    private blur(image: HTMLImageElement): Texture
    {
        const gl = this.gl
        
        const width = image.width
        const height = image.height

        // Load image into texture
        const texture = new Texture(gl, gl.RGB8, width, height)
        texture.write(image)

        const result = new Texture(gl, gl.RGB8, width, height)
        const blur = new Compute(gl, blurSrc, result)

        blur.uniformTexture("u_image", texture)
        gl.uniform2i(blur.uniformLocation("u_resolution"), width, height)

        gl.uniform1fv(blur.uniformLocation("u_blur"), Comparer.BLUR.data)
        gl.uniform1f(blur.uniformLocation("u_weight"), Comparer.BLUR_WEIGHT)

        // Blur image slightly
        blur.run()
        return result
    }


    public compare(): number
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

        return result[0]
    }

}
